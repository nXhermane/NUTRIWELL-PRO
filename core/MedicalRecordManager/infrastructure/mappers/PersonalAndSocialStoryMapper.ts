import { PersonalAndSocialStory } from "./../../domain";
import { Mapper, GastrointestinalState, PittsburghSleepQuality, MaritalStatus, PhysicalActivityLevel, Ethnicity } from "@shared";
import { PersonalAndSocialStoryPersistenceType } from "./../repositories/types";
import { PersonalAndSocialStoryDto } from "./../dtos/PersonalAndSocialStoryDto";
export class PersonalAndSocialStoryMapper implements Mapper<PersonalAndSocialStory, PersonalAndSocialStoryPersistenceType, PersonalAndSocialStoryDto> {
   toPersistence(entity: PersonalAndSocialStory): PersonalAndSocialStoryPersistenceType {
      return {
         ...entity.getProps(),
      };
   }
   toDomain(record: PersonalAndSocialStoryPersistenceType): PersonalAndSocialStory {
      const { id, createdAt, updatedAt, ...otherProps } = record;
      return new PersonalAndSocialStory({
         id,
         createdAt,
         updatedAt,
         props: {
            gastrointestinalState: otherProps.gastrointestinalState as GastrointestinalState,
            sleepQuality: otherProps.sleepQuality as PittsburghSleepQuality,
            isSmoker: otherProps.isSmoker,
            isAlcoholConsumer: otherProps.isAlcoholConsumer,
            maritalStatus: otherProps.maritalStatus as MaritalStatus,
            physicalActivity: otherProps.physicalActivity as PhysicalActivityLevel,
            ethnicity: otherProps.ethnicity as Ethnicity,
            otherInformation: otherProps.otherInformation,
         },
      });
   }
   toResponse(entity: PersonalAndSocialStory): PersonalAndSocialStoryDto {
      return { ...entity.getProps() };
   }
}
