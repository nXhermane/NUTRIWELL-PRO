import { Service } from "./../../domain";
import { Mapper, Time, NutritionistServiceType, NutritionistServicePatientType } from "@shared";
import { ServicePersistenceType } from "./../repositories/types";
import { ServiceDto } from "./../dtos";
export class ServiceMapper implements Mapper<Service, ServicePersistenceType, ServiceDto> {
   toPersistence(entity: Service): ServicePersistenceType {
      const { duration, consultationPlaces, ...otherProps } = entity.getProps();
      return { duration: duration.time, consultationPlaces: Array.from(consultationPlaces), ...otherProps };
   }
   toDomain(record: ServicePersistenceType): Service {
      const { id, createdAt, updatedAt, duration, consultationPlaces, type, patientType, ...otherProps } = record;
      return new Service({
         id,
         createdAt,
         updatedAt,
         props: {
            duration: new Time(duration),
            consultationPlaces: new Set(consultationPlaces),
            type: type as NutritionistServiceType,
            patientType: patientType as NutritionistServicePatientType,
            ...otherProps,
         },
      });
   }
   toResponse(entity: Service): ServiceDto {
      const { duration, consultationPlaces, ...otherProperty } = entity.getProps();
      return { duration: duration.time, consultationPlaces: Array.from(consultationPlaces), ...otherProperty };
   }
}
