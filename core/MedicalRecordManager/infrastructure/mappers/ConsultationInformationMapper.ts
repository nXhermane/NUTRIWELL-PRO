import { ConsultationInformation } from "./../../domain";
import { Mapper } from "@shared";
import { ConsultationInformationPersistenceType } from "./../repositories/types";
import { ConsultationInformationDto } from "./../dtos/ConsultationInformationDto";
export class ConsultationInformationMapper
   implements Mapper<ConsultationInformation, ConsultationInformationPersistenceType, ConsultationInformationDto>
{
   toPersistence(entity: ConsultationInformation): ConsultationInformationPersistenceType {
      return entity.getProps();
   }
   toDomain(record: ConsultationInformationPersistenceType): ConsultationInformation {
      const { id, createdAt, updatedAt, ...otherProps } = record;
      return new ConsultationInformation({
         id,
         createdAt,
         updatedAt,
         props: { ...otherProps },
      });
   }
   toResponse(entity: ConsultationInformation): ConsultationInformationDto {
      const { id, ...otherProperty } = entity.getProps();
      return otherProperty;
   }
}
