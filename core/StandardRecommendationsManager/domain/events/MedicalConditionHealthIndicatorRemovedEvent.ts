import { AggregateID, HealthIndicator, IDomainEvent } from "@/core/shared";

export interface IMedicalConditionHealthIndicatorRemovedObject {
    medicalConditionId: AggregateID;
    healthIndicator: HealthIndicator
}
export class MedicalConditionHealthIndicatorRemovedEvent implements IDomainEvent {
    dateTimeOccurred: Date;
    data: IMedicalConditionHealthIndicatorRemovedObject;
    constructor(data: IMedicalConditionHealthIndicatorRemovedObject) {
        this.data = data;
        this.dateTimeOccurred = new Date();
    }
    getAggregateId(): AggregateID {
        return this.data.medicalConditionId
    }

}