import { AggregateID, NeedsRecommendation } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface MedicalConditionRecommendationAddedObject {
   medicalConditionId: AggregateID;
   recommendations: NeedsRecommendation[];
}
@DomainEventMessage("Recommendation added to Medical Condition: Patient Profil",true)
export class MedicalConditionRecommendationAddedEvent extends DomainEvent<MedicalConditionRecommendationAddedObject> {

}

