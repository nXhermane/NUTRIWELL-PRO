import { AggregateID, CDate, NeedsRecommendation, NutrientNeedsValue, Result } from "@/core/shared";
import { PatientProfil } from "../aggregates/PatientProfil";
import { PatientNeeds } from "../entities/PatientNeeds";
import { IApplyRecommendationToStandardNeeds } from "./interfaces/ApplyRecommendationToStandardNeeds";
import { MedicalCondition } from "../entities/MedicalCondition";
import { Objective } from "../entities/Objective";
import { ComposedObject, IDataComposerService } from "./interfaces/DataComposerService";
import { VariableMappingTable } from "../entities/types";
import { INeedsRecommendationPriorityManagerService } from "@/core/shared/modules/NeedsRecommendations/services/interfaces/NeedsRecommendationPriorityManagerService";

export class ApplyRecommendationToStandarddNeeds implements IApplyRecommendationToStandardNeeds {
   constructor(
      private dataComposerService: IDataComposerService,
      private needsRecommendatonPriorityManager: INeedsRecommendationPriorityManagerService,
   ) { }
   async apply(patientNeeds: PatientNeeds, patientProfil: PatientProfil, applyMedicalConditionFirst: boolean = false): Promise<Result<PatientNeeds>> {
      try {
         const medicalConditions = patientProfil.getMedicalConditions();
         const objectives = patientProfil.getObjectives();
         if (applyMedicalConditionFirst) {
            const patientNeedsModifyByMedicalCondition = await this.applyMedicalConditionRecommendationToPatientNeeds(
               patientNeeds,
               medicalConditions,
               patientProfil
            );
            if (patientNeedsModifyByMedicalCondition.isFailure) return Result.fail<PatientNeeds>(String(patientNeedsModifyByMedicalCondition.err));
            const patientNeedsModifyByObjective = await this.applyObjectiveRecommendationToPatientNeeds(
               patientNeedsModifyByMedicalCondition.val,
               objectives,
               patientProfil
            );
            if (patientNeedsModifyByObjective.isFailure) return Result.fail<PatientNeeds>(String(patientNeedsModifyByObjective.err));
            return Result.ok<PatientNeeds>(patientNeedsModifyByObjective.val);
         } else {
            const patientNeedsModifyByObjective = await this.applyObjectiveRecommendationToPatientNeeds(patientNeeds, objectives, patientProfil);
            if (patientNeedsModifyByObjective.isFailure) return Result.fail<PatientNeeds>(String(patientNeedsModifyByObjective.err));
            const patientNeedsModifyByMedicalCondition = await this.applyMedicalConditionRecommendationToPatientNeeds(
               patientNeedsModifyByObjective.val,
               medicalConditions,
               patientProfil
            );
            if (patientNeedsModifyByMedicalCondition.isFailure) return Result.fail<PatientNeeds>(String(patientNeedsModifyByMedicalCondition.err));
            return Result.ok<PatientNeeds>(patientNeedsModifyByObjective.val);
         }
      } catch (error) {
         return Result.fail<PatientNeeds>(String(error));
      }
   }
   async applyMedicalConditionRecommendationToPatientNeeds(
      patientNeeds: PatientNeeds,
      medicalConditions: MedicalCondition[],
      patientProfil: PatientProfil
   ): Promise<Result<PatientNeeds>> {
      try {
         const patientNeedsProps = patientNeeds.getProps();
         const medicalConditionRecommendations = medicalConditions.flatMap((condition) => condition.getRecommendations());
         const [energy, macronutrients, micronutrients] = await Promise.all([
            this.applyRecommendationToNutrientGroup(patientNeedsProps.energy, medicalConditionRecommendations, patientProfil),
            this.applyRecommendationToNutrientGroup(
               patientNeedsProps.macronutrients,
               medicalConditionRecommendations,
               patientProfil,
            ),
            this.applyRecommendationToNutrientGroup(
               patientNeedsProps.micronutrients,
               medicalConditionRecommendations,
               patientProfil
            ),
         ]);

         patientNeeds.setEnergy(energy);
         patientNeeds.setMacronutrients(macronutrients);
         patientNeeds.setMicronutrients(micronutrients);

         return Result.ok<PatientNeeds>(patientNeeds);
      } catch (error) {
         return Result.fail<PatientNeeds>(String(error));
      }
   }
   async applyObjectiveRecommendationToPatientNeeds(patientNeeds: PatientNeeds, objectives: Objective[], patientProfil: PatientProfil): Promise<Result<PatientNeeds>> {
      try {
         const patientNeedsProps = patientNeeds.getProps();
         const objectiveRecommendations = objectives.flatMap((objective) => objective.getRecommendation());
         const [energy, macronutrients, micronutrients] = await Promise.all([
            this.applyRecommendationToNutrientGroup(patientNeedsProps.energy, objectiveRecommendations, patientProfil),
            this.applyRecommendationToNutrientGroup(patientNeedsProps.macronutrients, objectiveRecommendations, patientProfil),
            this.applyRecommendationToNutrientGroup(patientNeedsProps.micronutrients, objectiveRecommendations, patientProfil),
         ]);

         patientNeeds.setEnergy(energy);
         patientNeeds.setMacronutrients(macronutrients);
         patientNeeds.setMicronutrients(micronutrients);

         return Result.ok<PatientNeeds>(patientNeeds);
      } catch (error) {
         return Result.fail<PatientNeeds>(String(error));
      }
   }
   private async composeData(variableMappingTable: VariableMappingTable, patientProfil: PatientProfil): Promise<ComposedObject> {
      return await this.dataComposerService.compose(variableMappingTable, patientProfil);
   }
   private async applyRecommendationToNutrientGroup(
      nutrientGroup: { [nutrientCode: string]: NutrientNeedsValue },
      recommendations: NeedsRecommendation[],
      patientProfil: PatientProfil,
   ): Promise<{ [nutrientCode: string]: NutrientNeedsValue }> {
      const nutrientGroupModifyWithRecommendation: { [nutrientTagname: string]: NutrientNeedsValue } = {};

      const recommendationsByTag = recommendations.reduce((acc: { [key: string]: NeedsRecommendation[] }, recommendation) => {
         const nutrientTagName = recommendation.unpack().nutrientTagName;
         if (!acc[nutrientTagName]) {
            acc[nutrientTagName] = [];
         }
         acc[nutrientTagName].push(recommendation);
         return acc;
      }, {});

      for (const [nutrientTagname, nutrientNeedsValue] of Object.entries(nutrientGroup)) {
         const findedRecommendations = recommendationsByTag[nutrientTagname] || [];
         if (findedRecommendations.length > 0) {
            const contextVariableTables = findedRecommendations.reduce(
               (contextVariableTable, recommendation) => ({ ...contextVariableTable, ...recommendation.getVariableTable() }),
               {},
            );
            const context = await this.composeData(contextVariableTables, patientProfil);
            const recommendationValue = this.needsRecommendatonPriorityManager.resolve(
               nutrientNeedsValue,
               { ...context, currentDate: new CDate() },
               findedRecommendations,
            );
            nutrientGroupModifyWithRecommendation[nutrientTagname] = recommendationValue;
         } else {
            nutrientGroupModifyWithRecommendation[nutrientTagname] = nutrientNeedsValue;
         }
      }

      return nutrientGroupModifyWithRecommendation;
   }
}
