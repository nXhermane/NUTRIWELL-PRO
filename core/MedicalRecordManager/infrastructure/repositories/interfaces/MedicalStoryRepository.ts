import { MedicalStory } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface MedicalStoryRepository {
   save(medicalStory: MedicalStory, trx?: any): Promise<void>;
   getById(medicalStoryId: AggregateID): Promise<MedicalStory>;
   delete(medicalStoryId: AggregateID, trx?: any): Promise<void>;
}
