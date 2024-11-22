import { AggregateID } from "./../Entity";
export interface IDomainEvent {
   dateTimeOccurred: Date;
   data: any;
   getAggregateId(): AggregateID;
}
