import { AggregateID, IDomainEvent } from "@/core/shared";
import { AnthropometricMeasurement } from "../value-objects/AnthropometricMeasurement";
import { BodyCompositionMeasurement } from "../value-objects/BodyCompositionMeasurement";
import { MedicalAnalysisResult } from "../value-objects/MedicalAnalysisResult";

export interface PatientMeasurementUpadatedEvenntObject {
   patientId: AggregateID;
   medicalRecordId: AggregateID;
   measurements: (AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[];
}
export class PatientMeasurementUpdatedEvent implements IDomainEvent {
   dateTimeOccurred: Date;
   data: PatientMeasurementUpadatedEvenntObject;
   constructor(data: PatientMeasurementUpadatedEvenntObject) {
      this.data = data;
      this.dateTimeOccurred = new Date();
   }

   getAggregateId(): AggregateID {
      return this.data.medicalRecordId;
   }
}
