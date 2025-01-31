import { AggregateID } from "@shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";
export interface PatientCreatedEventData {
   patientId: AggregateID
}
@DomainEventMessage("Patient Created Event",true)
export class PatientCreatedEvent extends DomainEvent<PatientCreatedEventData> {
}
