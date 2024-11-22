import { GetAllPatientErrors } from "./GetAllPatientErrors";
import { GetAllPatientRequest } from "./GetAllPatientRequest";
import { GetAllPatientResponse } from "./GetAllPatientResponse";
import { UseCase, Mapper, Result, AppError, left, right } from "@shared";
import {
   PatientRepository,
   PatientRepositoryError,
   PatientDto,
   PatientPersistenceType,
   PatientRepositoryNotFoundException,
} from "./../../../../infrastructure";
import { Patient } from "./../../../../domain";

export class GetAllPatientUseCase implements UseCase<GetAllPatientRequest, GetAllPatientResponse> {
   constructor(
      private repo: PatientRepository,
      private mapper: Mapper<Patient, PatientPersistenceType, PatientDto>,
   ) {}

   async execute(request: GetAllPatientRequest): Promise<GetAllPatientResponse> {
      try {
         const patients = await this.repo.getAll(request?.paginated);
         return right(Result.ok<PatientDto[]>(patients.map((patient: Patient) => this.mapper.toResponse(patient))));
      } catch (e) {
         if (e instanceof PatientRepositoryNotFoundException) return right(Result.ok<PatientDto[]>([]));
         else if (e instanceof PatientRepositoryError) return left(new GetAllPatientErrors.PatientRepoError(e));
         else return left(new AppError.UnexpectedError(e));
      }
   }
}
