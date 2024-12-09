import { FormularName, FormularUnit, Mapper, NutritionalSource } from "@/core/shared";
import { NutritionFormular } from "../../domain/entities/NutritionFormular";
import { NutritionFormularDto } from "../dtos/NutritionFormularDto";
import { NutritionFormularPersistence } from "../repositories";
import { FormularExpression } from "../../domain/value-objects/FormularExpression";

export class NutritionFormularMapper implements Mapper<NutritionFormular, NutritionFormularPersistence, NutritionFormularDto> {
   toPersistence(entity: NutritionFormular): NutritionFormularPersistence {
      const formularExpressions = entity.formularExpressions.map(formular => {
         return {
            condition: formular.condition.toString(),
            expression: formular.expression.toString(),
            expressionVariables: formular.expressionVariables,
         };
      })
      return {
         id: entity.id,
         name: entity.name,
         source: entity.source,
         conditionVariables: entity.conditionVariables,
         formularExpressions: formularExpressions,
         unit: entity.unit ,
         systemVariableName: entity.systemVariableName,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: NutritionFormularPersistence): NutritionFormular {
      const name = FormularName.create(record.name)
      const unit = FormularUnit.create(record.unit)
      const source = NutritionalSource.create(record.source);
      const formularExpressions = record.formularExpressions.map((expression) => FormularExpression.create(expression));
      return new NutritionFormular({
         id: record.id,
         props: {
            name: name.val,
            unit: unit.val,
            systemVariableName: record.systemVariableName,
            source: source.val,
            conditionVariables: record.conditionVariables,
            formularExpressions: formularExpressions.map((expression) => expression.val),
         },
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
      });
   }
   toResponse(entity: NutritionFormular): NutritionFormularDto {
      const formularExpressions = entity.formularExpressions.map(formular => {
         return {
            condition: formular.condition.toString(),
            expression: formular.expression.toString(),
            expressionVariables: formular.expressionVariables,
         };
      })
      return {
         id: entity.id,
         name: entity.name,
         unit: entity.unit,
         source: entity.source,
         conditionVariables: entity.conditionVariables,
         formularExpressions: formularExpressions,
         systemVariableName: entity.systemVariableName,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
