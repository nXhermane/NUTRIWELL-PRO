import { Nutritionist, ConsultationPlace, Service, Speciality, ISpeciality } from "./../../domain";
import { Mapper, AggregateID, HumanName, Email, PhoneNumber, Address, Contact, Birthday, Gender, Image } from "@shared";
import {
   NutritionistPersistenceType,
   ServicePersistenceType,
   ConsultationPlacePersistenceType,
   NutritionistRecordPersistenceType,
} from "./../repositories/types";
import { NutritionistDto, ConsultationPlaceDto, ServiceDto } from "./../dtos";

export class NutritionistMapper implements Mapper<Nutritionist, NutritionistPersistenceType, NutritionistDto> {
   constructor(
      private mappers: {
         consultationPlace: Mapper<ConsultationPlace, ConsultationPlacePersistenceType, ConsultationPlaceDto>;
         service: Mapper<Service, ServicePersistenceType, ServiceDto>;
      },
   ) {}
   toPersistence(entity: Nutritionist): NutritionistPersistenceType {
      return {
         id: entity.id as string,
         name: entity.name,
         email: entity.email,
         contact: entity.contact,
         address: entity.address,
         birthday: entity.birthday,
         gender: entity.gender,
         images: entity.images,
         specialities: entity.specialities,
         consultationPlaceIds: entity.consultationPlaces.map((consultationPlace: any) => consultationPlace.id) as AggregateID[],
         serviceIds: entity.services.map((service: any) => service.id) as AggregateID[],
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: NutritionistRecordPersistenceType): Nutritionist {
      const { id, createdAt, updatedAt, ...otherProps } = record;
      const name = new HumanName(record.name);
      const email = Email.create(record.email).val;
      const contact = new Contact({
         email: Email.create(record.contact.email).val,
         phoneNumber: new PhoneNumber(record.contact.phoneNumber),
      });
      const address = new Address(record.address);
      const birthday = new Birthday(record.birthday);
      const gender = Gender.create(record.gender).val;
      const images = record.images.map((uri: string) => new Image(uri));
      const specialities = new Set(record.specialities.map((speciality: ISpeciality) => new Speciality(speciality)));
      const consultationPlaces = record.consultationPlaces.map((consultationPlace: ConsultationPlacePersistenceType) =>
         this.mappers.consultationPlace.toDomain(consultationPlace),
      );
      const services = record.services.map((service: ServicePersistenceType) => this.mappers.service.toDomain(service));

      return new Nutritionist({
         id,
         createdAt,
         updatedAt,
         props: { name, email, contact, birthday, address, gender, images, specialities, consultationPlaces, services },
      });
   }
   toResponse(entity: Nutritionist): NutritionistDto {
      const { consultationPlaces, services } = entity.getProps();
      return {
         id: entity.id,
         name: entity.name,
         email: entity.email,
         contact: entity.contact,
         address: entity.address,
         birthday: entity.birthday,
         gender: entity.gender,
         images: entity.images,
         specialities: entity.specialities,
         consultationPlaces: consultationPlaces.map((consultationPlace: ConsultationPlace) =>
            this.mappers.consultationPlace.toResponse(consultationPlace),
         ),
         services: services.map((service: Service) => this.mappers.service.toResponse(service)),
      };
   }
}
