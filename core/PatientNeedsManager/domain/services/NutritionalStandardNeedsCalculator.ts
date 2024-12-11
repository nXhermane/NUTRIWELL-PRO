import { IDataComposerService } from "./interfaces/DataComposerService";
import { INutritionalStandardNeedsCalculator } from "./interfaces/NutritionalStandardNeedsCalculator";
import { EvaluateMathExpression } from "@/core/shared";
import { NutrientNeedsValue, PatientNeeds } from "../entities/PatientNeeds";
import { PatientProfil } from "../aggregates/PatientProfil";
import { PatientNeedsModel } from "../entities/PatientNeedsModel";
import { NutrientDescriptor } from "../value-objects/NutrientDescriptor";
import { NutritionalStandardNeedsCalculatorError } from "./errors/NutritionalStandardNeedsCalculatorError";
export type NutrientModelGroup = { [nutrientTagname: string]: NutrientDescriptor };

// TODO :
export class NutritionalStandardNeedsCalculator implements INutritionalStandardNeedsCalculator {
   constructor(private dataComposerService: IDataComposerService) {}
   async generatePatientNeeds(
      patientProfil: PatientProfil,
      patientNeedsModel: PatientNeedsModel,
      additionalContext: { [key: string]: any } = {},
   ): Promise<PatientNeeds> {
      const patientNeedsModelProps = patientNeedsModel.getProps();
      const energyNeedsValue = await this.calculateEnergyProportion(patientProfil, patientNeedsModelProps.energyMetrics, { ...additionalContext });
      // NOTE: ici c'est consideré que l'energie est une variable calculer sans tenir compte des macronutriment
      // TODO : Je dois reussir a trouver une méthode pour traverser ce goulot d'étranglement
      const energyAdditionalContext = Object.fromEntries(
         Object.values(energyNeedsValue).map((nutrientNeedsValue) => [nutrientNeedsValue.tagname, nutrientNeedsValue.value]),
      );
      const macronutrientsNeedsValue = await this.calculateMacronutrientProportion(patientProfil, patientNeedsModelProps.macronutrients, {
         ...additionalContext,
         ...energyAdditionalContext,
      });
      const micronutrientsNeedsValue = await this.calculateMicronutrientProportion(patientProfil, patientNeedsModelProps.micronutrients, {
         ...additionalContext,
         ...energyAdditionalContext,
      });
      const patientNeedsResult = PatientNeeds.create({
         patientProfilId: patientProfil.id,
         energy: energyNeedsValue,
         micronutrients: micronutrientsNeedsValue,
         macronutrients: macronutrientsNeedsValue,
      });
      if (patientNeedsResult.isFailure)
         throw new NutritionalStandardNeedsCalculatorError(`Erreur lors de la génération des besoins alimentaires : ${patientNeedsResult.err}`);
      return patientNeedsResult.val;
   }
   private async calculateMicronutrientProportion(
      patientProfil: PatientProfil,
      micronutrientsModel: NutrientModelGroup,
      additionalContext: { [key: string]: any } = {},
   ): Promise<{ [micronutrientName: string]: NutrientNeedsValue }> {
      const micronutrientsNeedsValue: { [micronutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(micronutrientsModel)) {
         micronutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(
            value,
            patientProfil,
            additionalContext,
         );
      }
      return micronutrientsNeedsValue;
   }

   private async calculateEnergyProportion(
      patientProfil: PatientProfil,
      energyModel: NutrientModelGroup,
      additionalContext: { [key: string]: any } = {},
   ): Promise<{ [energyType: string]: NutrientNeedsValue }> {
      const energyNeedsValue: { [energyType: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(energyModel)) {
         energyNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(value, patientProfil, additionalContext);
      }
      return energyNeedsValue;
   }
   private async calculateMacronutrientProportion(
      patientProfil: PatientProfil,
      macronutrientsModel: NutrientModelGroup,
      additionalContext: { [key: string]: any } = {},
   ): Promise<{ [macroNutrientName: string]: NutrientNeedsValue }> {
      const macroNutrientsNeedsValue: { [macroNutrientName: string]: NutrientNeedsValue } = {};
      for (const [key, value] of Object.entries(macronutrientsModel)) {
         macroNutrientsNeedsValue[key] = await this.calculateNutrientNeedsFormNutrientNeedsCalculatationModel(
            value,
            patientProfil,
            additionalContext,
         );
      }
      return macroNutrientsNeedsValue;
   }

   private async calculateNutrientNeedsFormNutrientNeedsCalculatationModel(
      nutrientModel: NutrientDescriptor,
      patientProfil: PatientProfil,
      additionalContext: { [key: string]: any } = {},
   ): Promise<NutrientNeedsValue> {
      const variableMappingTable = nutrientModel.getVariableTable();
      const composedTable = await this.dataComposerService.compose(variableMappingTable, patientProfil, additionalContext);
      const nutrientValue = EvaluateMathExpression.evaluate(nutrientModel.expression, composedTable);
      return {
         tagname: nutrientModel.tagname,
         value: nutrientValue as number,
         unit: nutrientModel.unit,
      };
   }
}
