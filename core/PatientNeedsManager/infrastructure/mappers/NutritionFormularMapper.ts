import { Mapper, NutritionalSource } from "@/core/shared";
import { NutritionFormular } from "../../domain/entities/NutritionFormular";
import { NutritionFormularDto } from "../dtos/NutritionFormularDto";
import { NutritionFormularPersistence } from "../repositories";
import { FormularExpression } from "../../domain/value-objects/FormularExpression";

export class NutritionFormularMapper implements Mapper<NutritionFormular, NutritionFormularPersistence, NutritionFormularDto> {
   toPersistence(entity: NutritionFormular): NutritionFormularPersistence {
      return {
         id: entity.id,
         name: entity.name,
         source: entity.source,
         conditionVariables: entity.conditionVariables,
         formularExpressions: entity.formularExpressions,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: NutritionFormularPersistence): NutritionFormular {
      const source = NutritionalSource.create(record.source);
      const formularExpressions = record.formularExpressions.map((expression) => FormularExpression.create(expression));
      return new NutritionFormular({
         id: record.id,
         props: {
            name: record.name,
            source: source.val,
            conditionVariables: record.conditionVariables,
            formularExpressions: formularExpressions.map((expression) => expression.val),
         },
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
      });
   }
   toResponse(entity: NutritionFormular): NutritionFormularDto {
      return {
         id: entity.id,
         name: entity.name,
         source: entity.source,
         conditionVariables: entity.conditionVariables,
         formularExpressions: entity.formularExpressions,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
