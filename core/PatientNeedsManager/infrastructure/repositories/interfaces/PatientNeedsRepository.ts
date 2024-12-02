import { PatientNeeds } from "@/core/PatientNeedsManager/domain/entities/PatientNeeds";
import { AggregateID } from "@/core/shared";

export interface PatientNeedsRepository {
    getById(patientNeedsId: AggregateID): Promise<PatientNeeds>
    save(patientNeeds: PatientNeeds, trx?: any): Promise<void>
    delete(patientNeedsId: AggregateID, trx?: any): Promise<void>
}