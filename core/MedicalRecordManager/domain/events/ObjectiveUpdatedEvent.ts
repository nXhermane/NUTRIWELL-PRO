import { AggregateID, IDomainEvent } from "@shared";
import { Objective } from "../entities/Objective";

export class objectiveUpdatedEvent implements IDomainEvent {
   dateTimeOccurred: Date;
   data: {
      objective: Objective;
   };
   constructor(objective: Objective) {
      this.dateTimeOccurred = new Date();
      this.data = { objective };
   }
   getAggregateId(): AggregateID {
      return this.data.objective.id;
   }
}
