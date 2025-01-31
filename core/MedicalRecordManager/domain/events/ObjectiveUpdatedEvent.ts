import { Objective } from "../entities/Objective";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface ObjectiveUpdatedEventData {
   objective: Objective; 
}
@DomainEventMessage("Patient Goal Updated",true)
export class ObjectiveUpdatedEvent extends DomainEvent<ObjectiveUpdatedEventData> {
  
}
