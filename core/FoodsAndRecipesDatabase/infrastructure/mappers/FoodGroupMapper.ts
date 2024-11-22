import { Mapper } from "@shared";
import { FoodGroup } from "../../domain";
import { FoodGroupDto } from "../dtos";
import { FoodGroupPersistenceType } from "../repositories";
export class FoodGroupMapper implements Mapper<FoodGroup, FoodGroupPersistenceType, FoodGroupDto> {
   toPersistence(entity: FoodGroup): FoodGroupPersistenceType {
      const entityProps = entity.getProps();
      const foodGroupPersistence: FoodGroupPersistenceType = {
         groupId: entityProps.id as string,
         groupCode: entityProps.foodGroupCode,
         groupName: entityProps.foodGroupName,
         groupNameF: entityProps.foodGroupNameF,
         createdAt: entityProps.createdAt,
         updatedAt: entityProps.updatedAt,
      };
      return foodGroupPersistence;
   }
   toDomain(record: FoodGroupPersistenceType): FoodGroup {
      return new FoodGroup({
         id: record.groupId,
         updatedAt: record.updatedAt,
         props: {
            foodGroupCode: record.groupCode,
            foodGroupName: record.groupName,
            foodGroupNameF: record.groupNameF,
         },
      });
   }
   toResponse(entity: FoodGroup): FoodGroupDto {
      return this.toPersistence(entity);
   }
}
