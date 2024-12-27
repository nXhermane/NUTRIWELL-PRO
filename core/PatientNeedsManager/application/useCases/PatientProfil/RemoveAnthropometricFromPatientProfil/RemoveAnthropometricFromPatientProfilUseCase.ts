import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { RemoveAnthropometricFromPatientProfilRequest } from "./RemoveAnthropometricFromPatientProfilRequest";
import { RemoveAnthropometricFromPatientProfilResponse } from "./RemoveAnthropometricFromPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { RemoveAnthropometricFromPatientProfilErrors } from "./RemoveAnthropometricFromPatientProfilErrors";

export class RemoveAnthropometricFromPatientProfilUseCase
   implements UseCase<RemoveAnthropometricFromPatientProfilRequest, RemoveAnthropometricFromPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: RemoveAnthropometricFromPatientProfilRequest): Promise<RemoveAnthropometricFromPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         request.anthropometricMeasureCode.forEach((code) => patientProfil.removeAnthropometricMeasure(code));
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError)
            return left(new RemoveAnthropometricFromPatientProfilErrors.PatientProfilRepoError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
