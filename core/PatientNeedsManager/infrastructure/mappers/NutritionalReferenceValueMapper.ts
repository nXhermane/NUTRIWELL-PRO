import { Mapper, NutrientTagname, NutrientUnit, NutritionalSource } from "@/core/shared";
import { NutritionalReferenceValue } from "../../domain/entities/NutritionalReferenceValue";
import { NutritionalReferenceValueDto } from "../dtos/NutritionalReferenceValueDto";
import { NutritionalReferenceValuePersistence } from "../repositories";
import { NutritionalRef } from "../../domain/value-objects/NutritionalRef";

export class NutritionalReferenceValueMapper
   implements Mapper<NutritionalReferenceValue, NutritionalReferenceValuePersistence, NutritionalReferenceValueDto>
{
   toPersistence(entity: NutritionalReferenceValue): NutritionalReferenceValuePersistence {
      const { values } = entity.getProps();
      const nutritionalRefs = values.map((value) => {
         const unpackedValue = value.unpack();
         return {
            condition: unpackedValue.condition.toString(),
            weight: unpackedValue.weight,
            bme: unpackedValue.bme,
            anr: unpackedValue.anr,
            amt: unpackedValue.amt,
            as: unpackedValue.as,
         };
      });
      return {
         id: entity.id,
         tagname: entity.tagname,
         source: entity.source,
         unit: entity.unit,
         values: nutritionalRefs,
         conditionVariables: entity.variables,
         systemVariableName: entity.systemVariableName,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: NutritionalReferenceValuePersistence): NutritionalReferenceValue {
      const { values, id, createdAt, updatedAt, ...otherProps } = record;
      const unit = NutrientUnit.create(otherProps.unit);
      const tagname = NutrientTagname.create(otherProps.tagname);
      const nutritionalRefs = values.map((value) => NutritionalRef.create(value));
      const source = NutritionalSource.create(record.source);
      return new NutritionalReferenceValue({
         id,
         createdAt,
         updatedAt,
         props: {
            tagname: tagname.val,
            source: source.val,
            unit: unit.val,
            values: nutritionalRefs.map((res) => res.val),
            variables: record.conditionVariables,
            systemVariableName: record.systemVariableName,
         },
      });
   }
   toResponse(entity: NutritionalReferenceValue): NutritionalReferenceValueDto {
      const { values, id, createdAt, updatedAt, ...otherProps } = entity.getProps();
      const nutritionalRefs = values.map((value) => {
         const unpackedValue = value.unpack();
         return {
            condition: unpackedValue.condition.toString(),
            weight: unpackedValue.weight,
            bme: unpackedValue.bme,
            anr: unpackedValue.anr,
            amt: unpackedValue.amt,
            as: unpackedValue.as,
         };
      });
      return {
         tagname: entity.tagname,
         source: entity.source,
         unit: entity.unit,
         values: nutritionalRefs,
         systemVariableName: entity.systemVariableName,
         id,
         createdAt,
         updatedAt,
      };
   }
}
