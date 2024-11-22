import { Mapper, Contact, Email, PhoneNumber, Sexe, Address, IAddress, Gender, Birthday, HumanName, Image } from "@shared";
import { PatientDto } from "./../dtos/PatientDto";
import { Patient } from "./../../domain";
import { PatientPersistenceType } from "./../repositories/types";
export class PatientMapper implements Mapper<Patient, PatientPersistenceType, PatientDto> {
   toPersistence(entity: Patient): PatientPersistenceType {
      return {
         id: String(entity.id),
         name: entity.name,
         gender: entity.gender,
         contact: entity.contact,
         address: entity.address,
         birthday: entity.birthday,
         occupation: entity.occupation as string,
         images: entity.images,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: PatientPersistenceType): Patient {
      const contactData = record.contact as { email: string; phoneNumber: string };
      const contact = Contact.create({
         email: Email.create(contactData?.email).val,
         phoneNumber: PhoneNumber.create(contactData?.phoneNumber).val,
      }).val;

      const address = Address.create(record?.address as IAddress).val;
      const gender = Gender.create(record.gender as "M" | "F" | "O").val;
      const name = HumanName.create(record.name).val;
      const birthday = Birthday.create(record.birthday as string).val;
      const imagesData = record.images as string[];
      const images = imagesData.map((uri: string) => new Image(uri));
      const { occupation, createdAt, updatedAt, id } = record;
      return new Patient({
         id,
         createdAt,
         updatedAt,
         props: {
            name,
            contact,
            address,
            gender,
            birthday,
            occupation: occupation as string,
            images,
         },
      });
   }
   toResponse(entity: Patient): PatientDto {
      return {
         id: entity.id,
         name: entity.name,
         gender: entity.gender,
         contact: entity.contact,
         address: entity.address,
         birthday: entity.birthday,
         occupation: entity.occupation,
         images: entity.images,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
