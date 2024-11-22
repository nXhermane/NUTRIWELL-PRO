import SmartCalc from "smartcal";
import { Macronutrients, NutrientNeedsCalculationModel, PatientNeedsModel } from "../entities/PatientNeedsModel";
import { PatientProfil } from "../aggregates/PatientProfil";
import { IDataComposerService } from "./interfaces/DataComposerService";
import { INutritionalNeedsCalculator } from "./interfaces/NutritionalNeedsCalculator";
import { AggregateID } from "@/core/shared";
import { NutrientNeedsValue, PatientNeeds } from "../entities/PatientNeeds";



export class NutritionalNeedsCalculator implements INutritionalNeedsCalculator {
   constructor(private dataComposerService: IDataComposerService) {}
   async generatePatientNeeds(patientProfil: PatientProfil, patientNeedsModel: PatientNeedsModel): Promise<PatientNeeds> {
      const patientNeedsModelProps = patientNeedsModel.getProps();
      const macronutrientsNeedsValue = await this.calculateMacronutrientProportion(patientProfil, patientNeedsModelProps.macronutrients);
      const micronutrientsNeedsValue = await this.calculateMicronutrientProportion(patientProfil, patientNeedsModelProps.micronutrients);
      const energyNeedsValue = await this.calculateEnergyProportion(patientProfil, patientNeedsModelProps.energy);
      const patientNeedsResult = PatientNeeds.create({
         patientId: patientProfil.patientId,
         energy: energyNeedsValue,
         micronutrients: micronutrientsNeedsValue,
         macronutrients: macronutrientsNeedsValue,
      });
      if (patientNeedsResult.isFailure) throw new Error(`Erreur lors de la génération des besoins alimentaires : ${patientNeedsResult.err}`);
      return patientNeedsResult.val;
   }
   private async calculateMicronutrientProportion(
      patientProfil: PatientProfil,
      micronutrientsModel: Macronutrients,
   ): Promise<{ [micronutrientName: string]: NutrientNeedsValue }> {
      const micronutrientsNeedsValue: { [micronutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(micronutrientsModel)) {
         micronutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfil);
      }
      return micronutrientsNeedsValue;
   }

   private async calculateEnergyProportion(
      patientProfil: PatientProfil,
      energyModel: Macronutrients,
   ): Promise<{ [energyType: string]: NutrientNeedsValue }> {
      const energyNeedsValue: { [energyType: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(energyModel)) {
         energyNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfil);
      }
      return energyNeedsValue;
   }
   private async calculateMacronutrientProportion(
      patientProfil: PatientProfil,
      macronutrientsModel: Macronutrients,
   ): Promise<{ [macroNutrientName: string]: NutrientNeedsValue }> {
      const macroNutrientsNeedsValue: { [macroNutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(macronutrientsModel)) {
         macroNutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfil);
      }
      return macroNutrientsNeedsValue;
   }

   private async calculateNutrientNeedsFormNutrientNeedsCalculatationModel(
      nutrientModel: NutrientNeedsCalculationModel,
      patientProfil: PatientProfil,
   ): Promise<NutrientNeedsValue> {
      const variableMappingTable = nutrientModel.variables;
      const composedTable = await this.dataComposerService.compose<PatientProfil>(variableMappingTable, patientProfil);
      const nutrientValue = SmartCalc(nutrientModel.value, composedTable);
      return {
         value: nutrientValue as number,
         unit: nutrientModel.unit,
      };
   }
}
