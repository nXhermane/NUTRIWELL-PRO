import { PatientProfil } from "@/core/PatientNeedsManager/domain/aggregates/PatientProfil";
import { AggregateID } from "@/core/shared";

export interface PatientProfilRepository {
   getById(patientProfilOrPatientId: AggregateID): Promise<PatientProfil>;
   save(patientProfil: PatientProfil): Promise<void>;
   delete(patientProfilOrPatientId: AggregateID): Promise<void>;
}
