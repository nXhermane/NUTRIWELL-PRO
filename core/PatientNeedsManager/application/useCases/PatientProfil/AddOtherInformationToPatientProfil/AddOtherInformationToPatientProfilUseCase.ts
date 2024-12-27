import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { AddOtherInformationToPatientProfilErrors } from "./AddOtherInformationToPatientProfilErrors";
import { AddOtherInformationToPatientProfilRequest } from "./AddOtherInformationToPatientProfilRequest";
import { AddOtherInformationToPatientProfilResponse } from "./AddOtherInformationToPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { PatientProfil } from "@/core/PatientNeedsManager/domain";

export class AddOtherInformationToPatientProfilUseCase
   implements UseCase<AddOtherInformationToPatientProfilRequest, AddOtherInformationToPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: AddOtherInformationToPatientProfilRequest): Promise<AddOtherInformationToPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         this.addOtherInformationToPatientProfil(patientProfil, request.otherInformations);
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError) return left(new AddOtherInformationToPatientProfilErrors.PatientProfilRepoError(error));
         else return left(new AppError.UnexpectedError(error));
      }
   }
   private addOtherInformationToPatientProfil(patientProfil: PatientProfil, otherInformations: { [infoName: string]: any }) {
      for (const [key, value] of Object.entries(otherInformations)) {
         patientProfil.addOtherInformations(key, value);
      }
   }
}
