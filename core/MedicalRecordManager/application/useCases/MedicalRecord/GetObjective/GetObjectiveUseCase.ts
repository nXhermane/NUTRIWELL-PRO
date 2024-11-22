import { GetObjectiveErrors } from "./GetObjectiveErrors";
import { GetObjectiveRequest } from "./GetObjectiveRequest";
import { GetObjectiveResponse } from "./GetObjectiveResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, ObjectiveDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, left, right, AppError } from "@shared";

export class GetObjectiveUseCase implements UseCase<GetObjectiveRequest, GetObjectiveResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetObjectiveRequest): Promise<GetObjectiveResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const objective = this.getObjectiveToMedicalRecord(medicalRecord, request.objectiveId);
         return right(Result.ok<ObjectiveDto>(objective));
      } catch (e: any) {
         if (e instanceof GetObjectiveErrors.MedicalRecordNotFoundError)
            return left(new GetObjectiveErrors.MedicalRecordNotFoundError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new GetObjectiveErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private getObjectiveToMedicalRecord(medicalRecord: MedicalRecord, objectiveId: AggregateID): ObjectiveDto {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.objectives.find((objective: ObjectiveDto) => objective.id === objectiveId) as ObjectiveDto;
   }
}
