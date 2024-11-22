import { Mapper } from "@/core/shared";
import { NutritionFormular } from "../../domain/entities/NutritionFormular";
import { NutritionFormularDto } from "../dtos/NutritionFormularDto";
import { NutritionFormularPersistence } from "../repositories";

export class NutritionFormularMapper implements Mapper<NutritionFormular, NutritionFormularPersistence, NutritionFormularDto> {
   toPersistence(entity: NutritionFormular): NutritionFormularPersistence {
      return {
         id: entity.id,
         name: entity.name,
         expression: entity.expression,
         condition: entity.condition,
         variables: entity.variables,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: NutritionFormularPersistence): NutritionFormular {
      return new NutritionFormular({
         id: record.id,
         props: {
            name: record.name,
            expression: record.expression,
            condition: record.condition,
            variables: record.variables,
         },
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
      });
   }
   toResponse(entity: NutritionFormular): NutritionFormularDto {
      return {
         id: entity.id,
         name: entity.name,
         expression: entity.expression,
         condition: entity.condition,
         variables: entity.variables,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
