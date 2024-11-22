import { GetAllObjectiveErrors } from "./GetAllObjectiveErrors";
import { GetAllObjectiveRequest } from "./GetAllObjectiveRequest";
import { GetAllObjectiveResponse } from "./GetAllObjectiveResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, ObjectiveDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, right, left, AppError } from "@shared";

export class GetAllObjectiveUseCase implements UseCase<GetAllObjectiveRequest, GetAllObjectiveResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetAllObjectiveRequest): Promise<GetAllObjectiveResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const objectives = this.getAllObjectiveToMedicalRecord(medicalRecord);
         return right(Result.ok<ObjectiveDto[]>(objectives));
      } catch (e: any) {
         if (e instanceof GetAllObjectiveErrors.MedicalRecordNotFoundError)
            return left(new GetAllObjectiveErrors.MedicalRecordNotFoundError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new GetAllObjectiveErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private getAllObjectiveToMedicalRecord(medicalRecord: MedicalRecord): ObjectiveDto[] {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.objectives;
   }
}
