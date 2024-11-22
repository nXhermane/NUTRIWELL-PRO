import { AggregateID, HealthIndicator, IDomainEvent } from "@/core/shared";

export interface IMedicalConditionHealthIndicatorAddedObject {
    medicalConditionId: AggregateID;
    healthIndicator: HealthIndicator;
}
export class MedicalConditionHealthIndicatorAddedEvent implements IDomainEvent {
    dateTimeOccurred: Date;
    data: IMedicalConditionHealthIndicatorAddedObject
    constructor(data: IMedicalConditionHealthIndicatorAddedObject) {
        this.data = data;
        this.dateTimeOccurred = new Date();
    }
    getAggregateId(): AggregateID {
        return this.data.medicalConditionId;
    }

}