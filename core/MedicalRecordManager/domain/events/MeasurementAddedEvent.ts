import { AggregateID } from "@/core/shared";
import { AnthropometricMeasurement } from "../value-objects/AnthropometricMeasurement";
import { BodyCompositionMeasurement } from "../value-objects/BodyCompositionMeasurement";
import { MedicalAnalysisResult } from "../value-objects/MedicalAnalysisResult";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface IMeasurementAddedEventObject {
   medicalRecordId: AggregateID;
   patientId: AggregateID;
   measurements: (AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[];
}
@DomainEventMessage("Measurement Added to Medical Record",true)
export class MeasurementAddedEvent extends DomainEvent<IMeasurementAddedEventObject> {
 
}
