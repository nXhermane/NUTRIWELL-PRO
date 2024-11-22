import { UpdateMedicalStoryErrors } from "./UpdateMedicalStoryErrors";
import { UpdateMedicalStoryRequest } from "./UpdateMedicalStoryRequest";
import { UpdateMedicalStoryResponse } from "./UpdateMedicalStoryResponse";
import { MedicalRecord, MedicalStory, type CreateMedicalStoryProps } from "./../../../../domain";
import { MedicalRecordRepository, MedicalRecordRepositoryError, MedicalRecordDto, MedicalRecordPersistenceType } from "./../../../../infrastructure";
import { UseCase, AggregateID, left, right, Result, AppError } from "@shared";

export class UpdateMedicalStoryUseCase implements UseCase<UpdateMedicalStoryRequest, UpdateMedicalStoryResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}

   async execute(request: UpdateMedicalStoryRequest): Promise<UpdateMedicalStoryResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const medicalStory = this.getMedicalStoryFromMedicalRecord(medicalRecord);
         this.updateMedicalStory(medicalStory, request.data);
         this.updateMedicalRecord(medicalRecord, medicalStory);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof UpdateMedicalStoryErrors.MedicalRecordNotFoundError)
            return left(new UpdateMedicalStoryErrors.MedicalRecordNotFoundError(e.err.message));
         else if (e instanceof UpdateMedicalStoryErrors.MedicalRecordRepoError)
            return left(new UpdateMedicalStoryErrors.MedicalRecordRepoError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new UpdateMedicalStoryErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private updateMedicalStory(medicalStory: MedicalStory, data: Partial<CreateMedicalStoryProps>) {
      if (data?.pathologies) medicalStory.pathologies = data.pathologies;
      if (data?.drugie) medicalStory.drugie = data.drugie;
      if (data?.personalBackground) medicalStory.personalBackground = data.personalBackground;
      if (data?.familyBackground) medicalStory.familyBackground = data.familyBackground;
      if (data?.otherInformation) medicalStory.otherInformation = data.otherInformation;
   }

   private getMedicalStoryFromMedicalRecord(medicalRecord: MedicalRecord): MedicalStory {
      const medicalRecordProps = medicalRecord.getProps();
      return medicalRecordProps.medicalStory;
   }

   private updateMedicalRecord(medicalRecord: MedicalRecord, medicalStory: MedicalStory) {
      medicalRecord.updateMedicalStory(medicalStory);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e) {
         throw new UpdateMedicalStoryErrors.MedicalRecordRepoError(e);
      }
   }
}
