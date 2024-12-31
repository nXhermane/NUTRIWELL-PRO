import { AggregateID, AppError, left, Result, right, UseCase } from "@/core/shared";
import { RemoveMeasurementRequest } from "./RemoveMeasurementRequest";
import { RemoveMeasurementResponse } from "./RemoveMeasurementResponse";
import { MedicalRecordRepository } from "./../../../../infrastructure";
import {
   AnthropometricMeasurement,
   BodyCompositionMeasurement,
   createMeasurementFactory,
   MedicalAnalysisResult,
   MedicalRecord,
} from "./../../../../domain";
import { RemoveMeasurementErrors } from "./RemoveMeasurementErrors";

export class RemoveMeasurementUseCase implements UseCase<RemoveMeasurementRequest, RemoveMeasurementResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}
   async execute(request: RemoveMeasurementRequest): Promise<RemoveMeasurementResponse> {
      try {
         const measurements = await this.createMeasurement(request);
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         this.removeMeasurementToMedicalRecord(medicalRecord, measurements);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof RemoveMeasurementErrors.MeasurementFactoryError) {
            return left(e);
         } else if (e instanceof RemoveMeasurementErrors.MedicalRecordNotFoundError) {
            return left(e);
         } else if (e instanceof RemoveMeasurementErrors.MedicalRecordRepoError) {
            return left(e);
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }

   private async createMeasurement(
      request: RemoveMeasurementRequest,
   ): Promise<(AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[]> {
      const measurementResults = await Promise.all(request.measurements.map((measurement) => createMeasurementFactory(measurement)));
      const measurementCombinedResult = Result.combine(measurementResults);

      if (measurementCombinedResult.isFailure) throw new RemoveMeasurementErrors.MeasurementFactoryError(measurementCombinedResult.err);
      return measurementResults.map((measurementResult) => measurementResult.val);
   }

   private async getMedicalRecord(medicalRecordOrPatientId: AggregateID): Promise<MedicalRecord> {
      try {
         return await this.medicalRecordRepo.getById(medicalRecordOrPatientId);
      } catch (e: any) {
         throw new RemoveMeasurementErrors.MedicalRecordNotFoundError(e, medicalRecordOrPatientId);
      }
   }

   private removeMeasurementToMedicalRecord(
      medicalRecord: MedicalRecord,
      measurements: (AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[],
   ) {
      medicalRecord.removeMeasurement(...measurements);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e: any) {
         throw new RemoveMeasurementErrors.MedicalRecordRepoError(e);
      }
   }
}
