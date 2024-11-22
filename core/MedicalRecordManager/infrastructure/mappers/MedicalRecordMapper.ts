import {
   MedicalRecord,
   EatingBehavior,
   FoodDiary,
   FoodStory,
   MedicalStory,
   ConsultationInformation,
   Objective,
   PatientMeasurements,
   PersonalAndSocialStory,
} from "./../../domain";
import { Mapper, BaseEntityProps, Entity, AggregateID, RegistrationDate } from "@shared";
import {
   MedicalRecordPersistenceType,
   MedicalRecordPersistenceRecordType,
   ConsultationInformationPersistenceType,
   FoodStoryPersistenceType,
   MedicalStoryPersistenceType,
   ObjectivePersistenceType,
   PersonalAndSocialStoryPersistenceType,
   PatientMeasurementPersistenceType,
   FoodDiaryPersistenceType,
} from "./../repositories/types";
import { MedicalRecordDto } from "./../dtos/MedicalRecordDto";
import { FoodDiaryDto } from "./../dtos/FoodDiaryDto";
import { FoodStoryDto } from "./../dtos/FoodStoryDto";
import { MedicalStoryDto } from "./../dtos/MedicalStoryDto";
import { ConsultationInformationDto } from "./../dtos/ConsultationInformationDto";
import { ObjectiveDto } from "./../dtos/ObjectiveDto";
import { PatientMeasurementDto } from "./../dtos/PatientMeasurementDto";
import { PersonalAndSocialStoryDto } from "./../dtos/PersonalAndSocialStoryDto";

export class MedicalRecordMapper implements Mapper<MedicalRecord, MedicalRecordPersistenceType, MedicalRecordDto> {
   constructor(
      private mapper: {
         foodDiary: Mapper<FoodDiary, FoodDiaryPersistenceType, FoodDiaryDto>;
         foodStory: Mapper<FoodStory, FoodStoryPersistenceType, FoodStoryDto>;
         medicalStory: Mapper<MedicalStory, MedicalStoryPersistenceType, MedicalStoryDto>;
         consInfo: Mapper<ConsultationInformation, ConsultationInformationPersistenceType, ConsultationInformationDto>;
         objective: Mapper<Objective, ObjectivePersistenceType, ObjectiveDto>;
         patientMeasure: Mapper<PatientMeasurements, PatientMeasurementPersistenceType, PatientMeasurementDto>;
         personalAndSocialStory: Mapper<PersonalAndSocialStory, PersonalAndSocialStoryPersistenceType, PersonalAndSocialStoryDto>;
      },
   ) {}
   toPersistence(entity: MedicalRecord): MedicalRecordPersistenceType {
      return {
         id: entity.id as string,
         patientId: entity.patientId as string,
         medicalStoryId: entity.getMedicalStory().id as string,
         foodStoryId: entity.getFoodStory().id as string,
         consultationInformationId: entity.getConsultationInformation().id as string,
         personalAndSocialStorieId: entity.getPersonalAndSocialStory().id as string,
         patientMeasurementId: entity.getMeasure().id as string,
         foodDiaryIds: entity.foodDiaries.map((foodDiary: any) => foodDiary.id as AggregateID),
         objectiveIds: entity.objectives.map((objective: any) => objective.id),
         eatingBehaviors: entity.getEatingBehavior().map((eatBeh: any) => ({
            date: eatBeh.date.toString(),
            eatingBehavior: eatBeh.eatingBehavior,
         })),
         status: "Active",
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: MedicalRecordPersistenceRecordType): MedicalRecord {
      const { id, updatedAt, createdAt, status } = record;
      return new MedicalRecord({
         id,
         updatedAt,
         createdAt,
         props: {
            patientId: record.patientId,
            foodDiaries: record.foodDiaries,
            consultationInformation: record.consultationInformation,
            measure: record.patientMeasurements,
            foodStory: record.foodStory,
            medicalStory: record.medicalStory,
            objectives: record.objectives,
            personalAndSocialStory: record.personalAndSocialStory,
            eatingBehaviors: record.eatingBehaviors.map(
               (eatBehav: any) =>
                  new EatingBehavior({
                     date: new RegistrationDate(eatBehav.date),
                     eatingBehavior: eatBehav.eatingBehavior,
                  }),
            ),
         },
      });
   }
   toResponse(entity: MedicalRecord): MedicalRecordDto {
      const entityProps = entity.getProps();
      return {
         foodDiaries: entityProps.foodDiaries.map((foodDiary: FoodDiary) => this.mapper.foodDiary.toResponse(foodDiary)),
         consultationInformation: this.mapper.consInfo.toResponse(entityProps.consultationInformation),
         foodStory: this.mapper.foodStory.toResponse(entityProps.foodStory),
         medicalStory: this.mapper.medicalStory.toResponse(entityProps.medicalStory),
         personalAndSocialStory: this.mapper.personalAndSocialStory.toResponse(entityProps.personalAndSocialStory),
         objectives: entityProps.objectives.map((obj: Objective) => this.mapper.objective.toResponse(obj)),
         eatingBehaviors: entityProps.eatingBehaviors.map((eatBehav: EatingBehavior) => ({
            date: eatBehav.date,
            eatingBehavior: eatBehav.eatingBehavior,
         })),
         measure: this.mapper.patientMeasure.toResponse(entityProps.measure),
         id: entityProps.id,
         patientId: entityProps.patientId,
         createdAt: entityProps.createdAt,
         updatedAt: entityProps.updatedAt,
      };
   }
}
