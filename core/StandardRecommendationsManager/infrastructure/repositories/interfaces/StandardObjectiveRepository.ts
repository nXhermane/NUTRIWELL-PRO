import { AggregateID } from "@/core/shared";
import { StandardObjective } from "../../../domain/aggregate/StandardObjective";

export interface StandardObjectiveRepository {
    save(objective: StandardObjective): Promise<void>
    getById(objectiveId: AggregateID): Promise<StandardObjective>
    getAll(): Promise<StandardObjective[]>
    delete(objectiveId: AggregateID): Promise<void>
}