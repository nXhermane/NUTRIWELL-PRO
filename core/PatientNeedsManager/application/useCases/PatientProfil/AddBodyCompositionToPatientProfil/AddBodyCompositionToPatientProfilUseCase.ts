import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { AddBodyCompositionToPatientProfilRequest } from "./AddBodyCompositionToPatientProfilRequest";
import { AddBodyCompositionToPatientProfilResponse } from "./AddBodyCompositionToPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { PatientProfil } from "@/core/PatientNeedsManager/domain";
import { CreateHealthMetricsProps } from "@/core/PatientNeedsManager/domain/value-objects/types";
import { HealthMetrics } from "@/core/PatientNeedsManager/domain/value-objects/HealthMetrics";
import { AddBodyCompositionToPatientProfilErrors } from "./AddBodyCompositionToPatientProfilErrors";

export class AddBodyCompositionToPatientProfilUseCase
   implements UseCase<AddBodyCompositionToPatientProfilRequest, AddBodyCompositionToPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: AddBodyCompositionToPatientProfilRequest): Promise<AddBodyCompositionToPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         this.addBodyCompositionToPatientProfil(patientProfil, request.bodyCompositions);
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof AddBodyCompositionToPatientProfilErrors.DataValidationError) return left(error);
         else if (error instanceof PatientProfilRepositoryError)
            return left(new AddBodyCompositionToPatientProfilErrors.PatientProfilRepoError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
   private addBodyCompositionToPatientProfil(patientProfil: PatientProfil, bodyComposititons: CreateHealthMetricsProps[]) {
      const bodyCompostitionResutls = bodyComposititons.map((bodyComposition) => HealthMetrics.create(bodyComposition));
      const bodyCompositionCombinedResult = Result.combine(bodyCompostitionResutls);
      if (bodyCompositionCombinedResult.isFailure) {
         throw new AddBodyCompositionToPatientProfilErrors.DataValidationError(bodyCompositionCombinedResult.err);
      }
      bodyCompostitionResutls.forEach((bodyComposition) => patientProfil.addBodyCompositionMeasure(bodyComposition.val));
   }
}
