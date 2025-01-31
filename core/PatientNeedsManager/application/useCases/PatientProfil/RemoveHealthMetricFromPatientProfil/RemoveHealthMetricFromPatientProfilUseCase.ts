import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { RemoveHealthMetricFromPatientProfilRequest } from "./RemoveHealthMetricFromPatientProfilRequest";
import { RemoveHealthMetricFromPatientProfilResponse } from "./RemoveHealthMetricFromPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { RemoveHealthMetricFromPatientProfilErrors } from "./RemoveHealthMetricFromPatientProfilErrors";

export class RemoveHealthMetricFromPatientProfilUseCase
   implements UseCase<RemoveHealthMetricFromPatientProfilRequest, RemoveHealthMetricFromPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: RemoveHealthMetricFromPatientProfilRequest): Promise<RemoveHealthMetricFromPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         request.healthMetricCodes.forEach((code) => patientProfil.removeHealthMetric(code));
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError)
            return left(new RemoveHealthMetricFromPatientProfilErrors.PatientProfilRepoError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
