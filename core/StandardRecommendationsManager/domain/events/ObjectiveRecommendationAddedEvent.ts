import { AggregateID, IDomainEvent, NeedsRecommendation } from "@/core/shared";

export interface ObjectiveRecommendationAddedEventObject {
    objectiveId: AggregateID,
    recommendations: NeedsRecommendation[]
}

export class ObjectiveRecommendationAddedEvent implements IDomainEvent {
    dateTimeOccurred: Date;
    data: ObjectiveRecommendationAddedEventObject;
    constructor(eventObject: ObjectiveRecommendationAddedEventObject) {
        this.dateTimeOccurred = new Date()
        this.data = eventObject

    }
    getAggregateId(): AggregateID {
        return this.data.objectiveId
    }

}