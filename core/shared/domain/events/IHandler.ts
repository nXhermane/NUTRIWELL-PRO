import { IDomainEvent } from "./IDomainEvent";

export interface IHandler<IDomainEvent> {
   setupSubscriptions(): void;
}
