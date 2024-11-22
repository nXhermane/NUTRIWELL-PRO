import { UpdateConsultationInformationErrors } from "./UpdateConsultationInformationErrors";
import { UpdateConsultationInformationRequest } from "./UpdateConsultationInformationRequest";
import { UpdateConsultationInformationResponse } from "./UpdateConsultationInformationResponse";
import { MedicalRecord, ConsultationInformation, type CreateConsultationInformationProps } from "./../../../../domain";
import {
   MedicalRecordRepository,
   MedicalRecordRepositoryError,
   ConsultationInformationDto,
   MedicalRecordDto,
   MedicalRecordPersistenceType,
} from "./../../../../infrastructure";
import { UseCase, AggregateID, Result, left, right, AppError } from "@shared";

export class UpdateConsultationInformationUseCase implements UseCase<UpdateConsultationInformationRequest, UpdateConsultationInformationResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}

   async execute(request: UpdateConsultationInformationRequest): Promise<UpdateConsultationInformationResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const consultationInformation = this.getConsultationInformationFromMedicalRecord(medicalRecord);
         this.updateConsultationInformation(consultationInformation, request.data);
         this.updateMedicalRecord(medicalRecord, consultationInformation);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof UpdateConsultationInformationErrors.MedicalRecordNotFoundError)
            return left(new UpdateConsultationInformationErrors.MedicalRecordNotFoundError(e.err.message));
         else if (e instanceof UpdateConsultationInformationErrors.MedicalRecordRepoError)
            return left(new UpdateConsultationInformationErrors.MedicalRecordRepoError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new UpdateConsultationInformationErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private updateConsultationInformation(consultationInformation: ConsultationInformation, data: Partial<CreateConsultationInformationProps>) {
      if (data?.consultationMotive) consultationInformation.consultationMotive = data.consultationMotive;
      if (data?.expectations) consultationInformation.expectations = data.expectations;
      if (data?.clinicalObjective) consultationInformation.clinicalObjective = data.clinicalObjective;
      if (data?.otherInformation) consultationInformation.otherInformation = data.otherInformation;
   }

   private getConsultationInformationFromMedicalRecord(medicalRecord: MedicalRecord): ConsultationInformation {
      const medicalRecordProps = medicalRecord.getProps();
      return medicalRecordProps.consultationInformation;
   }

   private updateMedicalRecord(medicalRecord: MedicalRecord, consultationInformation: ConsultationInformation) {
      medicalRecord.updateConsultationInformation(consultationInformation);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e) {
         throw new UpdateConsultationInformationErrors.MedicalRecordRepoError(e);
      }
   }
}
