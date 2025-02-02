import { Aggregate } from "domain-eventrix/ddd";
import { Entity, AggregateID, CreateEntityProps } from "./Entity";
import { DomainEvent } from "domain-eventrix";
import { AggregateDomainEvent } from "./events/AggregateDomainEvent";

export abstract class AggregateRoot<EntityProps extends {}> extends Entity<EntityProps> {
   private _domainEvents: DomainEvent<any>[] = [];
   public publishEvents() {
      console.log("Event publier par: ", this.constructor.name);
   }
   getID(): AggregateID {
      return this.id;
   }
   getDomainEvents(): DomainEvent<any>[] {
      return this._domainEvents;
   }
   clearDomainEvent(): void {
      this._domainEvents = [];
   }
   protected addDomainEvent<T extends {}>(domainEvent: DomainEvent<T>): void {
      // Add the domain event to this aggregate's list of domain events
      this._domainEvents.push(domainEvent);
      // Add this aggregate instance to the domain event's list of aggregates who's
      // events it eventually needs to dispatch.
      AggregateDomainEvent.get().queueAggregateForDispatch(this as unknown as Aggregate);
      // Log the domain event
      this.logDomainEventAdded(domainEvent);
   }

   private logDomainEventAdded(domainEvent: DomainEvent<any>): void {
      const thisClass = Reflect.getPrototypeOf(this);
      console.info(`[Domain Event Created]:`, thisClass?.constructor.name, "==>", domainEvent.getName());
   }
}
