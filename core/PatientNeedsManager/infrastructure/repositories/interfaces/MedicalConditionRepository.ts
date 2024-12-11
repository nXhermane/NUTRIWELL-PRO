import { MedicalCondition } from "@/core/PatientNeedsManager/domain/entities/MedicalCondition";
import { AggregateID } from "@/core/shared";

export interface MedicalConditionRepository {
   getById(medicalConditionId: AggregateID): Promise<MedicalCondition>;
   save(medicalCondition: MedicalCondition, trx?: any): Promise<void>;
   delete(medicalConditionId: AggregateID, trx?: any): Promise<void>;
}
