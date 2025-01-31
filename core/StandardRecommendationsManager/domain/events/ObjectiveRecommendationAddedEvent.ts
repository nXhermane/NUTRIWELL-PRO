import { AggregateID, NeedsRecommendation } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface ObjectiveRecommendationAddedEventObject {
   objectiveId: AggregateID;
   recommendations: NeedsRecommendation[];
}
@DomainEventMessage("Recommendation added to patient Goal: PatientProfil",true)
export class ObjectiveRecommendationAddedEvent extends DomainEvent<ObjectiveRecommendationAddedEventObject> {

}
