import { PatientMeasurements } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface PatientMeasurementRepository {
   save(patientMeasurement: PatientMeasurements, trx?: any): Promise<void>;
   getById(patientMeasurementId: AggregateID): Promise<PatientMeasurements>;
   delete(patientMeasurementId: AggregateID, trx?: any): Promise<void>;
}
