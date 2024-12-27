import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { AddMedicalAnalyseToPatientProfilRequest } from "./AddMedicalAnalyseToPatientProfilRequest";
import { AddMedicalAnalyseToPatientProfilResponse } from "./AddMedicalAnalyseToPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { PatientProfil } from "@/core/PatientNeedsManager/domain";
import { CreateHealthMetricsProps } from "@/core/PatientNeedsManager/domain/value-objects/types";
import { HealthMetrics } from "@/core/PatientNeedsManager/domain/value-objects/HealthMetrics";
import { AddMedicalAnalyseToPatientProfilErrors } from "./AddMedicalAnalyseToPatientProfilErros";

export class AddMedicalAnlayseToPatientProfilUseCase
   implements UseCase<AddMedicalAnalyseToPatientProfilRequest, AddMedicalAnalyseToPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: AddMedicalAnalyseToPatientProfilRequest): Promise<AddMedicalAnalyseToPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         this.addMedicalAnlayseToPatientProfil(patientProfil, request.medicalAnalyses);
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof AddMedicalAnalyseToPatientProfilErrors.DataValidationError) return left(error);
         else if (error instanceof PatientProfilRepositoryError)
            return left(new AddMedicalAnalyseToPatientProfilErrors.PatientProfilRepoError(error));
         else return left(new AppError.UnexpectedError(error));
      }
   }
   private addMedicalAnlayseToPatientProfil(patientProfil: PatientProfil, medicalAnalyses: CreateHealthMetricsProps[]) {
      const medicalAnalysesResutls = medicalAnalyses.map((medicalAnalyse) => HealthMetrics.create(medicalAnalyse));
      const medicalAnalysesCombinedResult = Result.combine(medicalAnalysesResutls);
      if (medicalAnalysesCombinedResult.isFailure)
         throw new AddMedicalAnalyseToPatientProfilErrors.DataValidationError(medicalAnalysesCombinedResult.err);
      medicalAnalysesResutls.forEach((medicalAnalyse) => patientProfil.addMedicalAnalysesMeasure(medicalAnalyse.val));
   }
}
