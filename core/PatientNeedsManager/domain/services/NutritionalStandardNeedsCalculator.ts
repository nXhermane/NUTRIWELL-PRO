import SmartCalc from "smartcal";
import { Macronutrients, NutrientNeedsCalculationModel, PatientNeedsModel } from "../entities/PatientNeedsModel";
import { IDataComposerService } from "./interfaces/DataComposerService";
import { INutritionalStandardNeedsCalculator } from "./interfaces/NutritionalStandardNeedsCalculator";
import { AggregateID } from "@/core/shared";
import { NutrientNeedsValue, PatientNeeds } from "../entities/PatientNeeds";

export class NutritionalStandardNeedsCalculator implements INutritionalStandardNeedsCalculator {
   constructor(private dataComposerService: IDataComposerService) {}
   async generatePatientNeeds(patientProfilId: AggregateID, patientNeedsModel: PatientNeedsModel): Promise<PatientNeeds> {
      const patientNeedsModelProps = patientNeedsModel.getProps();
      const macronutrientsNeedsValue = await this.calculateMacronutrientProportion(patientProfilId, patientNeedsModelProps.macronutrients);
      const micronutrientsNeedsValue = await this.calculateMicronutrientProportion(patientProfilId, patientNeedsModelProps.micronutrients);
      const energyNeedsValue = await this.calculateEnergyProportion(patientProfilId, patientNeedsModelProps.energy);
      const patientNeedsResult = PatientNeeds.create({
         patientProfilId:patientProfilId ,
         energy: energyNeedsValue,
         micronutrients: micronutrientsNeedsValue,
         macronutrients: macronutrientsNeedsValue,
      });
      if (patientNeedsResult.isFailure) throw new Error(`Erreur lors de la génération des besoins alimentaires : ${patientNeedsResult.err}`);
      return patientNeedsResult.val;
   }
   private async calculateMicronutrientProportion(
      patientProfilId: AggregateID,
      micronutrientsModel: Macronutrients,
   ): Promise<{ [micronutrientName: string]: NutrientNeedsValue }> {
      const micronutrientsNeedsValue: { [micronutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(micronutrientsModel)) {
         micronutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfilId);
      }
      return micronutrientsNeedsValue;
   }

   private async calculateEnergyProportion(
      patientProfilId: AggregateID,
      energyModel: Macronutrients,
   ): Promise<{ [energyType: string]: NutrientNeedsValue }> {
      const energyNeedsValue: { [energyType: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(energyModel)) {
         energyNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfilId);
      }
      return energyNeedsValue;
   }
   private async calculateMacronutrientProportion(
      patientProfilId: AggregateID,
      macronutrientsModel: Macronutrients,
   ): Promise<{ [macroNutrientName: string]: NutrientNeedsValue }> {
      const macroNutrientsNeedsValue: { [macroNutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(macronutrientsModel)) {
         macroNutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfilId);
      }
      return macroNutrientsNeedsValue;
   }

   private async calculateNutrientNeedsFormNutrientNeedsCalculatationModel(
      nutrientModel: NutrientNeedsCalculationModel,
      patientProfilId: AggregateID,
   ): Promise<NutrientNeedsValue> {
      const variableMappingTable = nutrientModel.variables;
      const composedTable = await this.dataComposerService.compose(variableMappingTable,patientProfilId);
      const nutrientValue = SmartCalc(nutrientModel.value, composedTable);
      return {
         value: nutrientValue as number,
         unit: nutrientModel.unit,
      };
   }
}
