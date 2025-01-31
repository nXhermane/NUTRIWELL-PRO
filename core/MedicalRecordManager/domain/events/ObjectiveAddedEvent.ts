import { Objective } from "../entities/Objective";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface ObjectiveAddedEventData {
   objective: Objective
}
@DomainEventMessage("Patient Goal Added to Medical Record",true)
export class ObjectiveAddedEvent extends DomainEvent<ObjectiveAddedEventData> {
  
}
