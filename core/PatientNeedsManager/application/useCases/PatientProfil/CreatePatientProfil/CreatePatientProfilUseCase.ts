import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { CreatePatientProfilRequest } from "./CreatePatientProfilRequest";
import { CreatePatientProfilResponse } from "./CreatePatientProfilResponse";
import { PatientProfil } from "@/core/PatientNeedsManager/domain";
import { CreatePatientProfilErrors } from "./CreatePatientProfilErrors";
import { PatientProfilRepository, PatientProfilRepositoryError } from "../../../../infrastructure";

export class CreatePatientProfilUseCase implements UseCase<CreatePatientProfilRequest, CreatePatientProfilResponse> {
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: CreatePatientProfilRequest): Promise<CreatePatientProfilResponse> {
      try {
         const patientNeedsModel = " "; // TODO: Modify the implementation to attribuate a default PatientNeedsModel to patient based on PatientProfil Data
         const patientProfilFactoryResult = await PatientProfil.create({ ...request, patientNeedsModelId: " " });
         if (patientProfilFactoryResult.isFailure)
            return left(new CreatePatientProfilErrors.PatientProfilFactoryError(patientProfilFactoryResult.err));
         const patientProfil = patientProfilFactoryResult.val;
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError) return left(new CreatePatientProfilErrors.PatientProfilRepoError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
