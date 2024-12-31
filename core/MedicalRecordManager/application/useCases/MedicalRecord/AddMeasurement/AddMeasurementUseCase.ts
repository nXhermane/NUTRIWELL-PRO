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
import { MedicalRecordRepository } from "./../../../../infrastructure";
import { UseCase, AggregateID, Result, left, right, AppError } from "@shared";

export class AddMeasurementUseCase implements UseCase<AddMeasurementRequest, AddMeasurementResponse> {
   constructor(private medicalRecordRepo: MedicalRecordRepository) {}

   async execute(request: AddMeasurementRequest): Promise<AddMeasurementResponse> {
      try {
         const measurements = await this.createMeasurement(request);
         const medicalRecord = await this.getMedicalRecord(request.patientId);
         this.addMeasurementToMedicalRecord(medicalRecord, measurements);
         await this.saveMedicalRecord(medicalRecord);
         return right(Result.ok<void>());
      } catch (e: any) {
         if (e instanceof AddMeasurementErrors.MeasurementFactoryError) {
            return left(e)
         } else if (e instanceof AddMeasurementErrors.MedicalRecordNotFoundError) {
            return left(e)
         } else if (e instanceof AddMeasurementErrors.MedicalRecordRepoError) {
            return left(e)
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }

   private async createMeasurement(
      request: AddMeasurementRequest,
   ): Promise<(AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[]> {
      const measurementResults =  await Promise.all(request.measurements.map(measurement=> createMeasurementFactory(measurement)))
      const measurementCombinedResult = Result.combine(measurementResults)

      if (measurementCombinedResult.isFailure) throw new AddMeasurementErrors.MeasurementFactoryError(measurementCombinedResult.err);
      return measurementResults.map(measurementResult => measurementResult.val)
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
      measurements:( AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[],
   ) {
      medicalRecord.addMeasurement(...measurements);
   }

   private async saveMedicalRecord(medicalRecord: MedicalRecord) {
      try {
         await this.medicalRecordRepo.save(medicalRecord);
      } catch (e: any) {
         throw new AddMeasurementErrors.MedicalRecordRepoError(e);
      }
   }
}
