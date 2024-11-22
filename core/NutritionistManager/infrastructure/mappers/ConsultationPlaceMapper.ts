import { ConsultationPlace } from "./../../domain";
import { Mapper, Address } from "@shared";
import { ConsultationPlacePersistenceType } from "./../repositories/types";
import { ConsultationPlaceDto } from "./../dtos";
export class ConsultationPlaceMapper implements Mapper<ConsultationPlace, ConsultationPlacePersistenceType, ConsultationPlaceDto> {
   toPersistence(entity: ConsultationPlace): ConsultationPlacePersistenceType {
      const { address, ...otherProps } = entity.getProps();
      return { address: address.unpack(), ...otherProps };
   }
   toDomain(record: ConsultationPlacePersistenceType): ConsultationPlace {
      const { id, createdAt, updatedAt, address, ...otherProps } = record;
      const addressProps = new Address(address);
      return new ConsultationPlace({
         id,
         createdAt,
         updatedAt,
         props: { address: addressProps, ...otherProps },
      });
   }
   toResponse(entity: ConsultationPlace): ConsultationPlaceDto {
      const { address, ...otherProperty } = entity.getProps();
      return { address: address.unpack(), ...otherProperty };
   }
}
