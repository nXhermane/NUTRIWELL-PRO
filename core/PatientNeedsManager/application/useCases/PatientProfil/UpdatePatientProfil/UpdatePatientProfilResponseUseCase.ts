import { AppError, Gender, left, Result, right, UseCase } from "@/core/shared";
import { UpdatePatientProfilRequest } from "./UpdatePatientProfilRequest";
import { UpdatePatientProfilResponse } from "./UpdatePatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "../../../../infrastructure";
import { PatientProfil } from "../../../../domain";
import { Age } from "@/core/PatientNeedsManager/domain/value-objects/Age";
import { UpdatePatientProfilErrors } from "./UpdatePatientProfilErrors";
import { Height } from "@/core/PatientNeedsManager/domain/value-objects/Height";
import { Weight } from "@/core/PatientNeedsManager/domain/value-objects/Weight";

export class UpdatePatientProfilResponseUseCase implements UseCase<UpdatePatientProfilRequest, UpdatePatientProfilResponse> {
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: UpdatePatientProfilRequest): Promise<UpdatePatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         this.updatePatientProfil(patientProfil, request);
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof UpdatePatientProfilErrors.DataValidationError) return left(error);
         else if (error instanceof PatientProfilRepositoryError) return left(new UpdatePatientProfilErrors.PatientProfilRepoError(error));
         else return left(new AppError.UnexpectedError(error));
      }
   }

   private updatePatientProfil(patientProfil: PatientProfil, request: UpdatePatientProfilRequest): void {
      if (request.age) {
         const age = Age.create(request.age);
         if (age.isFailure) throw new UpdatePatientProfilErrors.DataValidationError(age.err);
         patientProfil.age = age.val;
      }
      if (request.height) {
         const height = Height.create(request.height);
         if (height.isFailure) throw new UpdatePatientProfilErrors.DataValidationError(height.err);
         patientProfil.height = height.val;
      }
      if (request.weight) {
         const weight = Weight.create(request.weight);
         if (weight.isFailure) throw new UpdatePatientProfilErrors.DataValidationError(weight.err);
         patientProfil.weight = weight.val;
      }
      if (request.gender) {
         const gender = Gender.create(request.gender);
         if (gender.isFailure) throw new UpdatePatientProfilErrors.DataValidationError(gender.err);
         patientProfil.gender = gender.val;
      }
      if (request.physicalActivityLevel) {
         patientProfil.physicalActivityLevel = request.physicalActivityLevel;
      }
      if (request.otherInformations) {
         for (const [key, value] of Object.entries(request.otherInformations)) {
            patientProfil.addOtherInformations(key, value);
         }
      }
   }
}
