import { CreateEatingBehaviorErrors } from "./CreateEatingBehaviorErrors";
import { CreateEatingBehaviorRequest } from "./CreateEatingBehaviorRequest";
import { CreateEatingBehaviorResponse } from "./CreateEatingBehaviorResponse";
import { MedicalRecord, EatingBehavior } from "./../../../../domain";
import { MedicalRecordRepository, MedicalRecordRepositoryError, EatingBehaviorDto } from "./../../../../infrastructure";
import { UseCase, AggregateID, Result, right, left, AppError } from "@shared";

export class CreateEatingBehaviorUseCase implements UseCase<CreateEatingBehaviorRequest, CreateEatingBehaviorResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}

   async execute(request: CreateEatingBehaviorRequest): Promise<CreateEatingBehaviorResponse> {
      try {
         const eatingBehavior = this.createEatingBehavior(request);
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         this.addEatingBehaviorToMedicalRecord(medicalRecord, eatingBehavior);
         await this.saveMedicalRecord(medicalRecord);
         return right(
            Result.ok<EatingBehaviorDto>({
               date: eatingBehavior.date,
               eatingBehavior: eatingBehavior.eatingBehavior,
            }),
         );
      } catch (e: any) {
         if (e instanceof CreateEatingBehaviorErrors.EatingBehaviorFactoryError) {
            return left(new CreateEatingBehaviorErrors.EatingBehaviorFactoryError(e.err.message));
         } else if (e instanceof CreateEatingBehaviorErrors.MedicalRecordNotFoundError) {
            return left(new CreateEatingBehaviorErrors.MedicalRecordNotFoundError(e.err.message));
         } else if (e instanceof CreateEatingBehaviorErrors.MedicalRecordRepoError) {
            return left(new CreateEatingBehaviorErrors.MedicalRecordRepoError(e.err.message));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }

   private createEatingBehavior(request: CreateEatingBehaviorRequest): EatingBehavior {
      const eatingBehavior = EatingBehavior.create(request.data);
      if (eatingBehavior.isFailure) throw new CreateEatingBehaviorErrors.EatingBehaviorFactoryError(eatingBehavior.err);
      return eatingBehavior.val;
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new CreateEatingBehaviorErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private addEatingBehaviorToMedicalRecord(medicalRecord: MedicalRecord, eatingBehavior: EatingBehavior) {
      medicalRecord.addEatingBehavior(eatingBehavior);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e) {
         throw new CreateEatingBehaviorErrors.MedicalRecordRepoError(e);
      }
   }
}
