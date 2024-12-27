import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { RemoveBodyCompositionMeasureFromPatientProfilRequest } from "./RemoveBodyCompositionMeasureFromPatientProfilRequest";
import { RemoveBodyCompositionMeasureFromPatientProfilRespone } from "./RemoveBodyCompositionMeasureFromPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { RemoveBodyCompositionMeasureFromPatientProfilErrors } from "./RemoveBodyCompositionMeasureFromPatientProfilErrors";

export class RemoveBodyCompositionMeasureFromPatientProfilUseCase
   implements UseCase<RemoveBodyCompositionMeasureFromPatientProfilRequest, RemoveBodyCompositionMeasureFromPatientProfilRespone>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: RemoveBodyCompositionMeasureFromPatientProfilRequest): Promise<RemoveBodyCompositionMeasureFromPatientProfilRespone> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         request.bodyCompositionMeasureCode.forEach((code) => patientProfil.removeBodyCompositionMeasure(code));
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError)
            return left(new RemoveBodyCompositionMeasureFromPatientProfilErrors.PatientProfilRepoError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
