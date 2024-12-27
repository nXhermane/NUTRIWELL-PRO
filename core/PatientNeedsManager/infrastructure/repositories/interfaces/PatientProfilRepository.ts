import { PatientProfil } from "@/core/PatientNeedsManager/domain/aggregates/PatientProfil";
import { AggregateID } from "@/core/shared";

export interface PatientProfilRepository {
   /**
    *
    * @param patientProfilOrPatientId
    */
   getById(patientProfilOrPatientId: AggregateID): Promise<PatientProfil>;
   /**
    *
    * @param patientProfil
    */
   save(patientProfil: PatientProfil): Promise<void>;
   /**
    *
    * @param patientProfilOrPatientId
    */
   delete(patientProfilOrPatientId: AggregateID): Promise<void>;
}
