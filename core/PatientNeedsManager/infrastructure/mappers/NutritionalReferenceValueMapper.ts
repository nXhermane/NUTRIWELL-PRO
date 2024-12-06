import { Mapper, NutritionalSource } from "@/core/shared";
import { NutritionalReferenceValue } from "../../domain/entities/NutritionalReferenceValue";
import { NutritionalReferenceValueDto } from "../dtos/NutritionalReferenceValueDto";
import { NutritionalReferenceValuePersistence } from "../repositories";
import { NutritionalRef } from "../../domain/value-objects/NutritionalRef";

export class NutritionalReferenceValueMapper
   implements Mapper<NutritionalReferenceValue, NutritionalReferenceValuePersistence, NutritionalReferenceValueDto>
{
   toPersistence(entity: NutritionalReferenceValue): NutritionalReferenceValuePersistence {
      return {
         id: entity.id,
         tagnames: entity.tagnames,
         source: entity.source,
         unit: entity.unit,
         values: entity.values,
         conditionVariables: entity.variables,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: NutritionalReferenceValuePersistence): NutritionalReferenceValue {
      const { values, id, createdAt, updatedAt, ...otherProps } = record;
      const nutritionalRefs = values.map((value) => new NutritionalRef(value));
      const source = NutritionalSource.create(record.source);
      return new NutritionalReferenceValue({
         id,
         createdAt,
         updatedAt,
         props: {
            tagnames: record.tagnames,
            source: source.val,
            unit: record.unit,
            values: nutritionalRefs,
            variables: record.conditionVariables,
         },
      });
   }
   toResponse(entity: NutritionalReferenceValue): NutritionalReferenceValueDto {
      const { values, id, createdAt, updatedAt, ...otherProps } = entity.getProps();
      const nutritionalRefs = values.map((value) => value.unpack());
      return {
         tagnames: entity.tagnames,
         source: entity.source,
         unit: entity.unit,
         values: nutritionalRefs,
         id,
         createdAt,
         updatedAt,
      };
   }
}
