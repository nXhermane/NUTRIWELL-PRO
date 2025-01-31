import { AggregateID } from "@shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface ObjectiveRemovedEventData {
   objectiveId: AggregateID
}
@DomainEventMessage("Patient Goal Removed From Medical Record",true)
export class ObjectiveRemovedEvent extends DomainEvent<ObjectiveRemovedEventData> {

}
