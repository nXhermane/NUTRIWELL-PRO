import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { RemoveMedicalAnalyseMeasureFromPatientProfilRequest } from "./RemoveMedicalAnalyseMeasureFromPatientProfilRequest";
import { RemoveMedicalAnalyseMeasureFromPatientProfilResponse } from "./RemoveMedicalAnalyseMeasureFromPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { RemoveMedicalAnalyseMeasureFromPatientProfilErrors } from "./RemoveMedicalAnalyseMeasureFromPatientProfilErrors";

export class RemoveMedicalAnalyseMeasureFromPatientProfilUseCase
   implements UseCase<RemoveMedicalAnalyseMeasureFromPatientProfilRequest, RemoveMedicalAnalyseMeasureFromPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: RemoveMedicalAnalyseMeasureFromPatientProfilRequest): Promise<RemoveMedicalAnalyseMeasureFromPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         request.medicalAnalyseMeasureCode.forEach((code) => patientProfil.removeMedicalAnalysesMeasure(code));
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError)
            return left(new RemoveMedicalAnalyseMeasureFromPatientProfilErrors.PatientProfilRepoError(error));
         else return left(new AppError.UnexpectedError(error));
      }
   }
}
