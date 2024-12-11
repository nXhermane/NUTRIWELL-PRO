import { PatientNeedsModel } from "@/core/PatientNeedsManager/domain/entities/PatientNeedsModel";
import { AggregateID } from "@/core/shared";

export interface PatientNeedsModelRepository {
   getById(patientNeedsModelId: AggregateID): Promise<PatientNeedsModel>;
   save(patientNeedsModel: PatientNeedsModel, trx?: any): Promise<void>;
   delete(patientNeedsModelId: AggregateID, trx?: any): Promise<void>;
   getAll(): Promise<PatientNeedsModel[]>;
}
