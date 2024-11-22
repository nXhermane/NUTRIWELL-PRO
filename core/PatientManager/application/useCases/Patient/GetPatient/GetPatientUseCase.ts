import { GetPatientErrors } from "./GetPatientErrors";
import { GetPatientRequest } from "./GetPatientRequest";
import { GetPatientResponse } from "./GetPatientResponse";
import { UseCase, Mapper, Result, AppError, left, right } from "@shared";
import {
   PatientRepository,
   PatientRepositoryError,
   PatientDto,
   PatientPersistenceType,
   PatientRepositoryNotFoundException,
} from "./../../../../infrastructure";
import { Patient } from "./../../../../domain";

export class GetPatientUseCase implements UseCase<GetPatientRequest, GetPatientResponse> {
   constructor(
      private repo: PatientRepository,
      private mapper: Mapper<Patient, PatientPersistenceType, PatientDto>,
   ) {}

   async execute(request: GetPatientRequest): Promise<GetPatientResponse> {
      try {
         const patient = await this.repo.getById(request.patientId);
         return right(Result.ok<PatientDto>(this.mapper.toResponse(patient)));
      } catch (e) {
         if (e instanceof PatientRepositoryNotFoundException) return left(new GetPatientErrors.PatientNotFoundError(e, request.patientId));
         else return left(new AppError.UnexpectedError(e));
      }
   }
}
