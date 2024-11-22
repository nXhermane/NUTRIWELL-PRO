import { ConsultationPlace } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface ConsultationPlaceRepository {
   save(consultationPlace: ConsultationPlace, trx?: any): Promise<void>;
   getById(consultationPlaceId: AggregateID): Promise<ConsultationPlace>;
   delete(consultationPlaceId: AggregateID, trx?: any): Promise<void>;
}
