import { PatientDataVariable } from "@/core/PatientNeedsManager/domain/aggregates/PatientDataVariable";
import { AggregateID } from "@/core/shared";

export interface PatientDataVariableRepository {
   save(patientDataVariable: PatientDataVariable): Promise<void>;
   getById(patientDataVariableOrPatientProfilId: AggregateID): Promise<PatientDataVariable>;
   delete(patientDataVariableOrPatientProfilId: AggregateID): Promise<void>;
}
