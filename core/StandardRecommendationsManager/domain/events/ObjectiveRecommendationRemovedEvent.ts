import { AggregateID, NeedsRecommendation } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface ObjectiveRecommendationRemovedEventObject {
   objectiveId: AggregateID;
   recommendations: NeedsRecommendation[];
}
@DomainEventMessage("Recommendation Removed from patient Goal: PatientProfil",true)
export class ObjectiveRecommendationRemovedEvent extends DomainEvent<ObjectiveRecommendationRemovedEventObject> {
 
}
