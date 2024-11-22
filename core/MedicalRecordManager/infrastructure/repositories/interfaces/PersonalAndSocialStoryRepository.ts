import { PersonalAndSocialStory } from "./../../../domain";
import { AggregateID, Paginated } from "@shared";
export interface PersonalAndSocialStoryRepository {
   save(personalAndSocialStory: PersonalAndSocialStory, trx?: any): Promise<void>;
   getById(personalAndSocialStoryId: AggregateID): Promise<PersonalAndSocialStory>;
   delete(personalAndSocialStoryId: AggregateID, trx?: any): Promise<void>;
}
