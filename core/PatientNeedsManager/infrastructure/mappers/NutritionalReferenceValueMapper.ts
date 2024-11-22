import { Mapper } from "@/core/shared";
import { NutritionalReferenceValue } from "../../domain/entities/NutritionalReferenceValue";
import { NutritionalReferenceValueDto } from "../dtos/NutritionalReferenceValueDto";
import { NutritionalReferenceValuePersistence } from "../repositories";
import { INutritionalRef, NutritionalRef } from "../../domain/value-objects/NutritionalRef";

export class NutritionalReferenceValueMapper
   implements Mapper<NutritionalReferenceValue, NutritionalReferenceValuePersistence, NutritionalReferenceValueDto>
{
   toPersistence(entity: NutritionalReferenceValue): NutritionalReferenceValuePersistence {
      return {
         id: entity.id,
         tagnames: entity.tagnames,
         origin: entity.origin,
         unit: entity.unit,
         values: entity.values,
         conditionVariables: entity.variables,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: NutritionalReferenceValuePersistence): NutritionalReferenceValue {
    const {values,id,createdAt,updatedAt,...otherProps}= record
    const nutritionalRefs = values.map(value => new NutritionalRef(value))
    return  new NutritionalReferenceValue({
        id,
        createdAt,
        updatedAt,
       props: {
        tagnames: record.tagnames,
        origin: record.origin,
        unit: record.unit,
        values: nutritionalRefs,
        variables: record.conditionVariables,
       }
     })
   }
   toResponse(entity: NutritionalReferenceValue): NutritionalReferenceValueDto {
    const {values,id, createdAt, updatedAt,...otherProps}= entity.getProps()
    const nutritionalRefs = values.map(value => value.unpack())
    return {
        tagnames: entity.tagnames,
        origin: entity.origin,
        unit: entity.unit,
        values: nutritionalRefs,
        id,
        createdAt,
        updatedAt,
     }
   }
}
