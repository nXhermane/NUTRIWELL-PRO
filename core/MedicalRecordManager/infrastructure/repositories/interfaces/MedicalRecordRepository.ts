import { MedicalRecord } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface MedicalRecordRepository {
   save(medicalRecord: MedicalRecord, trx?: any): Promise<void>;
   getById(medicalRecordOrPatientId: AggregateID): Promise<MedicalRecord>;
   delete(medicalRecordId: AggregateID, trx?: any): Promise<void>;
}
