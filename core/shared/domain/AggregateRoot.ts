import { Entity, CreateEntityProps } from "./Entity";
import { DomainEvents, IDomainEvent } from "./events";
export abstract class AggregateRoot<EntityProps extends {}> extends Entity<EntityProps> {
   private _domainEvents: IDomainEvent[] = [];
   public publishEvents() {
      console.log("Event publier par: ", this.constructor.name);
   }

   get domainEvents(): IDomainEvent[] {
      return this._domainEvents;
   }
   protected addDomainEvent(domainEvent: IDomainEvent): void {
      // Add the domain event to this aggregate's list of domain events
      this._domainEvents.push(domainEvent);
      // Add this aggregate instance to the domain event's list of aggregates who's
      // events it eventually needs to dispatch.
      DomainEvents.markAggregateForDispatch(this);
      // Log the domain event
      this.logDomainEventAdded(domainEvent);
   }

   public clearEvents(): void {
      this._domainEvents.splice(0, this._domainEvents.length);
   }

   private logDomainEventAdded(domainEvent: IDomainEvent): void {
      const thisClass = Reflect.getPrototypeOf(this);
      const domainEventClass = Reflect.getPrototypeOf(domainEvent);
      console.info(`[Domain Event Created]:`, thisClass?.constructor.name, "==>", domainEventClass?.constructor.name);
   }
}
