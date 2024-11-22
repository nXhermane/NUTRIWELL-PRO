import { ConsultationInformation } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface ConsultationInformationRepository {
   save(consultationInfo: ConsultationInformation, trx?: any): Promise<void>;
   getById(consultationInfoId: AggregateID): Promise<ConsultationInformation>;
   delete(consultationInfoId: AggregateID, trx?: any): Promise<void>;
}
