import { AggregateID } from "@/core/shared";
import { AnthropometricMeasurement } from "../value-objects/AnthropometricMeasurement";
import { BodyCompositionMeasurement } from "../value-objects/BodyCompositionMeasurement";
import { MedicalAnalysisResult } from "../value-objects/MedicalAnalysisResult";
import { DomainEvent } from "domain-eventrix";

export interface PatientMeasurementUpadatedEventObject {
   patientId: AggregateID;
   medicalRecordId: AggregateID;
   measurements: (AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult)[];
}
export class PatientMeasurementUpdatedEvent extends DomainEvent<PatientMeasurementUpadatedEventObject> {
}
