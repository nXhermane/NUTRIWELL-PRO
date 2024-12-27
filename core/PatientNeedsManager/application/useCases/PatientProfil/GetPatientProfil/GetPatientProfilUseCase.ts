import { AppError, left, Mapper, Result, right, UseCase } from "@/core/shared";
import { GetPatientProfilRequest } from "./GetPatientProfilRequest";
import { GetPatientProfilResponse } from "./GetPatientProfilResponse";
import { PatientProfilPersistence, PatientProfilRepository, PatientProfilRepositoryError } from "./../../../../infrastructure";
import { PatientProfil } from "../../../../domain";
import { PatientProfilDto } from "../../../../infrastructure/dtos/PatientProfilDto";
import { GetPatientProfilErrors } from "./GetPatientProfilErrors";

export class GetPatientProfilUseCase implements UseCase<GetPatientProfilRequest, GetPatientProfilResponse> {
   constructor(
      private repo: PatientProfilRepository,
      private mapper: Mapper<PatientProfil, PatientProfilPersistence, PatientProfilDto>,
   ) {}
   async execute(request: GetPatientProfilRequest): Promise<GetPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         const patientProfilDto = this.mapper.toResponse(patientProfil);
         return right(Result.ok<PatientProfilDto>(patientProfilDto));
      } catch (error) {
         if (error instanceof PatientProfilRepositoryError) return left(new GetPatientProfilErrors.PatientProfilNotFoundError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
}
