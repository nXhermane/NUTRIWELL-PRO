import { AggregateID } from "@/core/shared";
import { StandardMedicalCondition } from "../../../domain/aggregate/StandardMedicalCondition";

export interface StandardMedicalConditionRepository {
    save(medicalCondition: StandardMedicalCondition): Promise<void>;
    getById(medicalConditionId: AggregateID): Promise<StandardMedicalCondition>
    getAll(): Promise<StandardMedicalCondition[]>
    delete(medicalConditonId: AggregateID): Promise<void>
}