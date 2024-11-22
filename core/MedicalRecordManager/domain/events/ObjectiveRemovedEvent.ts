import { AggregateID, IDomainEvent } from "@shared";

export class ObjectiveRemovedEvent implements IDomainEvent {
   dateTimeOccurred: Date;
   data: { objectiveId: AggregateID };
   constructor(objectiveId: AggregateID) {
      this.dateTimeOccurred = new Date();
      this.data = { objectiveId };
   }
   getAggregateId(): AggregateID {
      return this.data.objectiveId;
   }
}
