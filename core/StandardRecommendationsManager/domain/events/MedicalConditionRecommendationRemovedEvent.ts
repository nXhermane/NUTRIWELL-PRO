import { AggregateID, IDomainEvent, NeedsRecommendation } from "@/core/shared";

export interface IMedicalConditionRecommendationRemovedEventObject {
    medicalConditionId: AggregateID;
    recommendations: NeedsRecommendation[]
}
export class MedicalConditionRecommendationRemovedEvent implements IDomainEvent {
    dateTimeOccurred: Date;
    data: IMedicalConditionRecommendationRemovedEventObject;
    constructor(data: IMedicalConditionRecommendationRemovedEventObject) {
        this.data = data;
        this.dateTimeOccurred = new Date();
    }
    getAggregateId(): AggregateID {
        return this.data.medicalConditionId;
    }

}