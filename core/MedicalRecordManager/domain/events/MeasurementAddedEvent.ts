import { AggregateID, IDomainEvent } from "@/core/shared";
import { AnthropometricMeasurement } from "../value-objects/AnthropometricMeasurement";
import { BodyCompositionMeasurement } from "../value-objects/BodyCompositionMeasurement";
import { MedicalAnalysisResult } from "../value-objects/MedicalAnalysisResult";

export interface IMeasurementAddedEventObject {
   medicalRecordId: AggregateID;
   patientId: AggregateID;
   measurements: (AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[];
}
export class MeasurementAddedEvent implements IDomainEvent {
   dateTimeOccurred: Date;
   data: IMeasurementAddedEventObject;
   constructor(measurementAddedEventObject: IMeasurementAddedEventObject) {
      this.data = measurementAddedEventObject;
      this.dateTimeOccurred = new Date();
   }

   getAggregateId(): AggregateID {
      return this.data.medicalRecordId;
   }
}
