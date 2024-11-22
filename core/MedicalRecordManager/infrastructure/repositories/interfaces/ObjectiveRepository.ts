import { Objective } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface ObjectiveRepository {
   save(objective: Objective, trx?: any): Promise<void>;
   getById(objectiveId: AggregateID): Promise<Objective>;
   delete(objectiveId: AggregateID, trx?: any): Promise<void>;
}
