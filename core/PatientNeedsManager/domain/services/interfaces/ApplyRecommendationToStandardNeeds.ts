import { Result } from "@/core/shared";
import { PatientProfil } from "../../aggregates/PatientProfil";
import { PatientNeeds } from "../../entities/PatientNeeds";
import { MedicalCondition } from "../../entities/MedicalCondition";
import { Objective } from "../../entities/Objective";

export interface IApplyRecommendationToStandardNeeds {
   apply(patientNeeds: PatientNeeds, patientProfil: PatientProfil, applyMedicalConditionFirst: boolean): Promise<Result<PatientNeeds>>;
   applyMedicalConditionRecommendationToPatientNeeds(
      patientNeeds: PatientNeeds,
      medicalConditions: MedicalCondition[],
      patientProfil: PatientProfil
   ): Promise<Result<PatientNeeds>>;
   applyObjectiveRecommendationToPatientNeeds(patientNeeds: PatientNeeds, objectives: Objective[], patientProfil: PatientProfil): Promise<Result<PatientNeeds>>;
}
