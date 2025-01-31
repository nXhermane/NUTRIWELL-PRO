import { AggregateID, HealthIndicator } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface IMedicalConditionHealthIndicatorAddedObject {
   medicalConditionId: AggregateID;
   healthIndicators: HealthIndicator[];
}
@DomainEventMessage("Health Indicator added to Medical Condition: PatientProfil",true)
export class MedicalConditionHealthIndicatorAddedEvent extends DomainEvent<IMedicalConditionHealthIndicatorAddedObject> {
 
}
