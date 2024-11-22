import { MedicalStory } from "./../../domain";
import { Mapper } from "@shared";
import { MedicalStoryPersistenceType } from "./../repositories/types";
import { MedicalStoryDto } from "./../dtos/MedicalStoryDto";
export class MedicalStoryMapper implements Mapper<MedicalStory, MedicalStoryPersistenceType, MedicalStoryDto> {
   toPersistence(entity: MedicalStory): MedicalStoryPersistenceType {
      return entity.getProps();
   }
   toDomain(record: MedicalStoryPersistenceType): MedicalStory {
      const { id, createdAt, updatedAt, ...otherProps } = record;
      return new MedicalStory({
         id,
         createdAt,
         updatedAt,
         props: { ...otherProps },
      });
   }
   toResponse(entity: MedicalStory): MedicalStoryDto {
      return entity.getProps();
   }
}
