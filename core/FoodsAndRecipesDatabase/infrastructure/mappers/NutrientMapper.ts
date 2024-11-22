import { Mapper } from "@shared";
import { Nutrient } from "../../domain";
import { NutrientPersistenceType } from "../repositories";
import { NutrientDto } from "../dtos";

export class NutrientMapper implements Mapper<Nutrient, NutrientPersistenceType, NutrientDto> {
   toPersistence(entity: Nutrient): NutrientPersistenceType {
      const nutrientPersistence: NutrientPersistenceType = {
         nutrientId: entity.id as string,
         nutrientCode: entity.nutrientCode,
         nutrientDecimal: entity.nutrientDecimals.toString(),
         nutrientName: entity.nutrientNameE,
         nutrientNameF: entity.nutrientNameF,
         nutrientUnit: entity.nutrientUnit,
         tagname: entity.nutrientINFOODSTagName,
         nutrientSymbol: "",
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
      return nutrientPersistence;
   }
   toDomain(record: NutrientPersistenceType): Nutrient {
      return new Nutrient({
         id: record.nutrientId,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            nutrientCode: record.nutrientCode,
            nutrientDecimals: parseInt(record.nutrientDecimal),
            nutrientINFOODSTagName: record.tagname,
            nutrientName: record.nutrientName,
            nutrientUnit: record.nutrientUnit,
            nutrientNameTranslate: {
               inFrench: record.nutrientNameF,
            },
         },
      });
   }
   toResponse(entity: Nutrient): NutrientDto {
      const dto: NutrientDto = {
         nutrientId: entity.id as string,
         nutrientCode: entity.nutrientCode,
         nutrientDecimal: entity.nutrientDecimals.toString(),
         nutrientName: entity.nutrientNameE,
         nutrientNameF: entity.nutrientNameF,
         nutrientUnit: entity.nutrientUnit,
         tagname: entity.nutrientINFOODSTagName,
      };
      return dto;
   }
}
