import { CreateObjectiveErrors } from "./CreateObjectiveErrors";
import { CreateObjectiveRequest } from "./CreateObjectiveRequest";
import { CreateObjectiveResponse } from "./CreateObjectiveResponse";
import { MedicalRecord, Objective } from "./../../../../domain";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, AppError, Result, right, left } from "@shared";

export class CreateObjectiveUseCase implements UseCase<CreateObjectiveRequest, CreateObjectiveResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}

   async execute(request: CreateObjectiveRequest): Promise<CreateObjectiveResponse> {
      try {
         const objective = await this.createObjective(request);
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         this.addObjectiveToMedicalRecord(medicalRecord, objective);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<AggregateID>(objective.id));
      } catch (e: any) {
         if (e instanceof CreateObjectiveErrors.ObjectiveFactoryError) {
            return left(new CreateObjectiveErrors.ObjectiveFactoryError(e.err.message));
         } else if (e instanceof CreateObjectiveErrors.MedicalRecordNotFoundError) {
            return left(new CreateObjectiveErrors.MedicalRecordNotFoundError(e.err.message));
         } else if (e instanceof CreateObjectiveErrors.MedicalRecordRepoError) {
            return left(new CreateObjectiveErrors.MedicalRecordRepoError(e.err.message));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }

   private async createObjective(request: CreateObjectiveRequest): Promise<Objective> {
      const objective = await Objective.create(request.data);
      if (objective.isFailure) throw new CreateObjectiveErrors.ObjectiveFactoryError(objective.err);
      return objective.val;
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new CreateObjectiveErrors.MedicalRecordNotFoundError(e);
      }
   }

   private addObjectiveToMedicalRecord(medicalRecord: MedicalRecord, objective: Objective) {
      medicalRecord.addObjective(objective);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e) {
         throw new CreateObjectiveErrors.MedicalRecordRepoError(e);
      }
   }
}
