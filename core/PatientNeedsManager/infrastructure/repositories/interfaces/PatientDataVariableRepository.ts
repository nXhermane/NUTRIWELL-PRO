import { PatientDataVariable } from "@/core/PatientNeedsManager/domain/aggregates/PatientDataVariable";
import { AggregateID } from "@/core/shared";

export interface PatientDataVariableRepository {
    save(patientDataVariable: PatientDataVariable): Promise<void>
    getById(patientDataVariableId: AggregateID): Promise<PatientDataVariable>
    delete(patientDataVariableId: AggregateID): Promise<void>
}