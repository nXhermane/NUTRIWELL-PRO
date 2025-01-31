import { AggregateID, NeedsRecommendation } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface IMedicalConditionRecommendationRemovedEventObject {
   medicalConditionId: AggregateID;
   recommendations: NeedsRecommendation[];
}
@DomainEventMessage("Recommendation removed From Medical Condition: PatientProfil",true)
export class MedicalConditionRecommendationRemovedEvent extends DomainEvent<IMedicalConditionRecommendationRemovedEventObject> {
   
}
