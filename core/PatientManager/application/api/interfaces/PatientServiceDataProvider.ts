import { PatientDto } from "../../../infrastructure";
import { AggregateID, Result } from "@/core/shared";

export interface IPatientServiceDataProvider {
   getPatientInfoById(patientId: AggregateID): Promise<Result<PatientDto>>;
}
