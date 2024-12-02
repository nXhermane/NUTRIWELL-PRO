import { Objective } from "@/core/PatientNeedsManager/domain/entities/Objective";
import { AggregateID } from "@/core/shared";

export interface ObjectiveRepository {
   getById(objectiveId: AggregateID, trx?: any): Promise<Objective>;
   save(objective: Objective, trx?: any): Promise<void>;
   delete(objectiveId: AggregateID, trx?: any): Promise<void>;
}
