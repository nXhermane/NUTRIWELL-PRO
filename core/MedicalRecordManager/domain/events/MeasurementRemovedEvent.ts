import { AggregateID } from "@/core/shared";
import { AnthropometricMeasurement } from "../value-objects/AnthropometricMeasurement";
import { BodyCompositionMeasurement } from "../value-objects/BodyCompositionMeasurement";
import { MedicalAnalysisResult } from "../value-objects/MedicalAnalysisResult";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface IMeasurementRemovedEventObject {
   medicalRecordId: AggregateID;
   patientId: AggregateID;
   measurements: (AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[];
}
@DomainEventMessage("Measurement Removed from Medical Record",true)
export class MeasurementRemovedEvent extends DomainEvent<IMeasurementRemovedEventObject> {

}
