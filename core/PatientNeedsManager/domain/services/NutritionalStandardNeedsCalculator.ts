import { NutrientNeedsCalculationModel } from "../entities/PatientNeedsModel.legacy";
import { IDataComposerService } from "./interfaces/DataComposerService";
import { INutritionalStandardNeedsCalculator } from "./interfaces/NutritionalStandardNeedsCalculator";
import { EvaluateMathExpression } from "@/core/shared";
import { NutrientNeedsValue, PatientNeeds } from "../entities/PatientNeeds";
import { PatientProfil } from "../aggregates/PatientProfil";
import { PatientNeedsModel } from "../entities/PatientNeedsModel";
import { NutrientDescriptor } from "../value-objects/NutrientDescriptor";
export type NutrientModelGroup = { [nutrientTagname: string]: NutrientDescriptor }

// TODO : 
export class NutritionalStandardNeedsCalculator implements INutritionalStandardNeedsCalculator {
   constructor(private dataComposerService: IDataComposerService) { }
   async generatePatientNeeds(patientProfil: PatientProfil, patientNeedsModel: PatientNeedsModel): Promise<PatientNeeds> {
      const patientNeedsModelProps = patientNeedsModel.getProps()
      const macronutrientsNeedsValue = await this.calculateMacronutrientProportion(patientProfil, patientNeedsModelProps.macronutrients);
      const micronutrientsNeedsValue = await this.calculateMicronutrientProportion(patientProfil, patientNeedsModelProps.micronutrients);
      const energyNeedsValue = await this.calculateEnergyProportion(patientProfil, patientNeedsModelProps.energyMetrics);
      const patientNeedsResult = PatientNeeds.create({
         patientProfilId: patientProfil.id,
         energy: energyNeedsValue,
         micronutrients: micronutrientsNeedsValue,
         macronutrients: macronutrientsNeedsValue,
      });
      if (patientNeedsResult.isFailure) throw new Error(`Erreur lors de la génération des besoins alimentaires : ${patientNeedsResult.err}`);
      return patientNeedsResult.val;
   }
   private async calculateMicronutrientProportion(
      patientProfil: PatientProfil,
      micronutrientsModel: NutrientModelGroup,
   ): Promise<{ [micronutrientName: string]: NutrientNeedsValue }> {
      const micronutrientsNeedsValue: { [micronutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(micronutrientsModel)) {
         micronutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfil);
      }
      return micronutrientsNeedsValue;
   }

   private async calculateEnergyProportion(
      patientProfil: PatientProfil,
      energyModel: NutrientModelGroup,
   ): Promise<{ [energyType: string]: NutrientNeedsValue }> {
      const energyNeedsValue: { [energyType: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(energyModel)) {
         energyNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfil);
      }
      return energyNeedsValue;
   }
   private async calculateMacronutrientProportion(
      patientProfil: PatientProfil,
      macronutrientsModel: NutrientModelGroup,
   ): Promise<{ [macroNutrientName: string]: NutrientNeedsValue }> {
      const macroNutrientsNeedsValue: { [macroNutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(macronutrientsModel)) {
         macroNutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfil);
      }
      return macroNutrientsNeedsValue;
   }

   private async calculateNutrientNeedsFormNutrientNeedsCalculatationModel(
      nutrientModel: NutrientDescriptor,
      patientProfil: PatientProfil,
   ): Promise<NutrientNeedsValue> {
      const variableMappingTable = nutrientModel.getVariableTable();
      const composedTable = await this.dataComposerService.compose(variableMappingTable, patientProfil);
      const nutrientValue = EvaluateMathExpression.evaluate(nutrientModel.expression, composedTable);
      return {
         tagname: nutrientModel.tagname,
         value: nutrientValue as number,
         unit: nutrientModel.unit,
      };
   }
}
