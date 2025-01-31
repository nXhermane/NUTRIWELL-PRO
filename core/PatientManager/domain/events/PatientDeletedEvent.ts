import { AggregateID } from "@shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface PatientDeletedEventData {
   patientId: AggregateID
}
@DomainEventMessage("Patient Deleted Event",true)
export class PatientDeletedEvent extends DomainEvent<PatientDeletedEventData>  {
   
}
