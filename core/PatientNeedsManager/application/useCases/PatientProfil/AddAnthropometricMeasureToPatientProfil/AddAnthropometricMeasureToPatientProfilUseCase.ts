import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { AddAnthropometricMeasureToPatientProfilRequest } from "./AddAnthropometricMeasureToPatientProfilRequest";
import { AddAnthropometricMeasureToPatientProfilResponse } from "./AddAnthropometricMeasureToPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { PatientProfil } from "@/core/PatientNeedsManager/domain";
import { CreateHealthMetricsProps } from "@/core/PatientNeedsManager/domain/value-objects/types";
import { HealthMetrics } from "@/core/PatientNeedsManager/domain/value-objects/HealthMetrics";
import { AddAnthropometricMeasureToPatientProfilErrors } from "./AddAnthropometricMeasureToPatientProfilErrors";

export class AddAnthropometricMeasureToPatientProfilUseCase
   implements UseCase<AddAnthropometricMeasureToPatientProfilRequest, AddAnthropometricMeasureToPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: AddAnthropometricMeasureToPatientProfilRequest): Promise<AddAnthropometricMeasureToPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         this.addAnthropometricMeasureToPatientProfil(patientProfil, request.anthropometricMeasures);
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof AddAnthropometricMeasureToPatientProfilErrors.DataValidationError) return left(error);
         else if (error instanceof PatientProfilRepositoryError)
            return left(new AddAnthropometricMeasureToPatientProfilErrors.PatientProfilRepoError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
   private addAnthropometricMeasureToPatientProfil(patientProfil: PatientProfil, anthropometricMeasures: CreateHealthMetricsProps[]) {
      const anthropometricMeasuresResults = anthropometricMeasures.map((anthropometricMeasure) => HealthMetrics.create(anthropometricMeasure));
      const anthropometricMeasureCombinedResutl = Result.combine(anthropometricMeasuresResults);
      if (anthropometricMeasureCombinedResutl.isFailure) {
         throw new AddAnthropometricMeasureToPatientProfilErrors.DataValidationError(anthropometricMeasureCombinedResutl.err);
      }
      anthropometricMeasuresResults.forEach((anthropometricMeasure) => patientProfil.addAnthropometricMeasure(anthropometricMeasure.val));
   }
}
