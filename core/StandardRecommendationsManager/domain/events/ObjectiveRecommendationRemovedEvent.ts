import { AggregateID, IDomainEvent, NeedsRecommendation } from "@/core/shared";

export interface ObjectiveRecommendationRemovedEventObject {
    objectiveId: AggregateID,
    recommendations: NeedsRecommendation[]
}

export class ObjectiveRecommendationRemovedEvent implements IDomainEvent {
    dateTimeOccurred: Date;
    data: ObjectiveRecommendationRemovedEventObject;
    constructor(eventOject: ObjectiveRecommendationRemovedEventObject) {
        this.dateTimeOccurred = new Date()
        this.data = eventOject
    }
    getAggregateId(): AggregateID {
        return this.data.objectiveId
    }

}