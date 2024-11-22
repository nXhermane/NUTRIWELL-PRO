import { GetConsultationInformationErrors } from "./GetConsultationInformationErrors";
import { GetConsultationInformationRequest } from "./GetConsultationInformationRequest";
import { GetConsultationInformationResponse } from "./GetConsultationInformationResponse";
import { MedicalRecord } from "./../../../../domain";
import { MedicalRecordDto, MedicalRecordPersistenceType, ConsultationInformationDto } from "./../../../../infrastructure";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Mapper, Result, AppError, left, right } from "@shared";

export class GetConsultationInformationUseCase implements UseCase<GetConsultationInformationRequest, GetConsultationInformationResponse> {
   constructor(
      private medicalRecordRepo: MedicalRecordRepository,
      private medicalRecordMapper: Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto>,
   ) {}

   async execute(request: GetConsultationInformationRequest): Promise<GetConsultationInformationResponse> {
      try {
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         const consultationInformation = this.getConsultationInformationToMedicalRecord(medicalRecord);
         return right(Result.ok<ConsultationInformationDto>(consultationInformation));
      } catch (e: any) {
         if (e instanceof GetConsultationInformationErrors.MedicalRecordNotFoundError)
            return left(new GetConsultationInformationErrors.MedicalRecordNotFoundError(e.err.message));
         else return left(new AppError.UnexpectedError(e));
      }
   }

   private async getMedicalRecord(medicalRecordId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordId);
      } catch (e) {
         throw new GetConsultationInformationErrors.MedicalRecordNotFoundError(e, medicalRecordId);
      }
   }

   private getConsultationInformationToMedicalRecord(medicalRecord: MedicalRecord): ConsultationInformationDto {
      const reponseMedicalRecord = this.medicalRecordMapper.toResponse(medicalRecord);
      return reponseMedicalRecord.consultationInformation;
   }
}
