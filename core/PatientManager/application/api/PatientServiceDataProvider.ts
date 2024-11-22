import { AggregateID, Mapper, Result } from "@/core/shared";
import { PatientDto, PatientPersistenceType, PatientRepository, PatientRepositoryError } from "../../infrastructure";
import { IPatientServiceDataProvider } from "./interfaces/PatientServiceDataProvider";
import { Patient } from "../../domain";

export class PatientServiceDataprovider implements IPatientServiceDataProvider {
   constructor(
      private patientRepo: PatientRepository,
      private patientMapper: Mapper<Patient, PatientPersistenceType, PatientDto>,
   ) {}
   async getPatientInfoById(patientId: AggregateID): Promise<Result<PatientDto>> {
      try {
         const patient = await this.patientRepo.getById(patientId);
         const patientDto = this.patientMapper.toResponse(patient);
         return Result.ok<PatientDto>(patientDto);
      } catch (error) {
         return error instanceof PatientRepositoryError
            ? Result.fail<PatientDto>(`[${e.code}]:${e.message}`)
            : Result.fail<PatientDto>(`Erreur inattendue. ${error?.constructor.name}`);
      }
   }
}
