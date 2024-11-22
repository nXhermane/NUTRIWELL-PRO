import { AddMeasurementErrors } from "./AddMeasurementErrors";
import { AddMeasurementRequest } from "./AddMeasurementRequest";
import { AddMeasurementResponse } from "./AddMeasurementResponse";
import {
   createMeasurementFactory,
   MedicalRecord,
   AnthropometricMeasurement,
   BodyCompositionMeasurement,
   MedicalAnalysisResult,
} from "./../../../../domain";
import { MedicalRecordRepository, MedicalRecordRepositoryError } from "./../../../../infrastructure";
import { UseCase, AggregateID, Result, left, right, AppError } from "@shared";

export class AddMeasurementUseCase implements UseCase<AddMeasurementRequest, AddMeasurementResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}

   async execute(request: AddMeasurementRequest): Promise<AddMeasurementResponse> {
      try {
         const measurement = await this.createMeasurement(request);
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         this.addMeasurementToMedicalRecord(medicalRecord, measurement);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof AddMeasurementErrors.MeasurementFactoryError) {
            return left(new AddMeasurementErrors.MeasurementFactoryError(e.err.message));
         } else if (e instanceof AddMeasurementErrors.MedicalRecordNotFoundError) {
            return left(new AddMeasurementErrors.MedicalRecordNotFoundError(e.err.message));
         } else if (e instanceof AddMeasurementErrors.MedicalRecordRepoError) {
            return left(new AddMeasurementErrors.MedicalRecordRepoError(e.err.message));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }

   private async createMeasurement(
      request: AddMeasurementRequest,
   ): Promise<AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult> {
      const measurement = await createMeasurementFactory(request.data);
      if (measurement.isFailure) throw new AddMeasurementErrors.MeasurementFactoryError(measurement.err);
      return measurement.val;
   }

   private async getMedicalRecord(medicalRecordOrPatientId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordOrPatientId);
      } catch (e: any) {
         throw new AddMeasurementErrors.MedicalRecordNotFoundError(e, medicalRecordOrPatientId);
      }
   }

   private addMeasurementToMedicalRecord(
      medicalRecord: MedicalRecord,
      measurement: AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult,
   ) {
      medicalRecord.addMeasurement(measurement);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e: any) {
         throw new AddMeasurementErrors.MedicalRecordRepoError(e);
      }
   }
}
