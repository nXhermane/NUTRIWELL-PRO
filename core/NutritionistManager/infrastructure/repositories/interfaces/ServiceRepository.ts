import { Service } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface ServiceRepository {
   save(service: Service, trx?: any): Promise<void>;
   getById(serviceId: AggregateID): Promise<Service>;
   delete(serviceId: AggregateID, trx?: any): Promise<void>;
}
