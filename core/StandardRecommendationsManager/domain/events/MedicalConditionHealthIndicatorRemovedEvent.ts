import { AggregateID, HealthIndicator } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface IMedicalConditionHealthIndicatorRemovedObject {
   medicalConditionId: AggregateID;
   healthIndicator: HealthIndicator;
}
@DomainEventMessage("Health indicator Removed From Medical Condition: PatientProfil",true)
export class MedicalConditionHealthIndicatorRemovedEvent extends DomainEvent<IMedicalConditionHealthIndicatorRemovedObject> {
   
}
