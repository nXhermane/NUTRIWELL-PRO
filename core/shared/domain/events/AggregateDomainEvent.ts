import { Aggregate, AggregateEventDispatcher } from "domain-eventrix/ddd";
export class AggregateDomainEvent extends AggregateEventDispatcher<Aggregate> {
   private static instance: null | AggregateDomainEvent = null;
   private constructor() {
    super()
   }
   public static get(): AggregateDomainEvent {
      if (!this.instance) this.instance = new AggregateDomainEvent();
      return this.instance;
   }
}
