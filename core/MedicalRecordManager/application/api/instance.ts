import { SQLiteDatabase } from "expo-sqlite";
import { IMedicalRecordDataProviderService } from "./interfaces/MedicalRecordDataProviderService";
import { db } from "../../infrastructure/database/db.config";
import { GetAllFoodDiaryUseCase } from "../useCases";
import {
   ConsultationInformationRepositoryImpl,
   FoodDiaryRepositoryImpl,
   FoodStoryRepositoryImpl,
   MedicalRecordRepositoryImpl,
   MedicalStoryRepositoryImpl,
   ObjectiveRepositoryImpl,
   PatientMeasurementRepositoryImpl,
   PersonalAndSocialStoryRepositoryImpl,
} from "../../infrastructure";
import { ConsultationInformationMapper } from "../../infrastructure/mappers/ConsultationInformationMapper";
import { FoodStoryMapper } from "../../infrastructure/mappers/FoodStoryMapper";
import { MedicalRecordMapper } from "../../infrastructure/mappers/MedicalRecordMapper";
import { MedicalStoryMapper } from "../../infrastructure/mappers/MedicalStoryMapper";
import { ObjectiveMapper } from "../../infrastructure/mappers/ObjectiveMapper";
import { PatientMeasurementMapper } from "../../infrastructure/mappers/PatientMeasurementMapper";
import { PersonalAndSocialStoryMapper } from "../../infrastructure/mappers/PersonalAndSocialStoryMapper";
import { FoodDiaryMapper } from "../../infrastructure/mappers/FoodDiaryMapper";
import { MedicalRecordDataProvider } from "./MedicalRecordDataProvider";

export type IMedicalRecordAPI = IMedicalRecordDataProviderService;

export class MedicalRecordAPI {
   private static instance: null | IMedicalRecordAPI = null;

  static async getInstance(): Promise<IMedicalRecordAPI> {
      if (MedicalRecordAPI.instance) {
         const expo: SQLiteDatabase = (await db).db as SQLiteDatabase;
         const consultationInfoMapper = new ConsultationInformationMapper();
         const foodDiaryMapper = new FoodDiaryMapper();
         const foodStoryMapper = new FoodStoryMapper();
         const medicalStoryMapper = new MedicalStoryMapper();
         const objectiveMapper = new ObjectiveMapper();
         const personalAndSocialMapper = new PersonalAndSocialStoryMapper();
         const patientMeasurementMapper = new PatientMeasurementMapper();
         const medicalRecodMapper = new MedicalRecordMapper({
            foodDiary: foodDiaryMapper,
            foodStory: foodStoryMapper,
            consInfo: consultationInfoMapper,
            medicalStory: medicalStoryMapper,
            personalAndSocialStory: personalAndSocialMapper,
            objective: objectiveMapper,
            patientMeasure: patientMeasurementMapper,
         });
         const consultationInfoRepo = new ConsultationInformationRepositoryImpl(expo as SQLiteDatabase, consultationInfoMapper);
         const foodDiaryRepo = new FoodDiaryRepositoryImpl(expo as SQLiteDatabase, foodDiaryMapper);
         const foodStoryRepo = new FoodStoryRepositoryImpl(expo as SQLiteDatabase, foodStoryMapper);
         const medicalStoryRepo = new MedicalStoryRepositoryImpl(expo as SQLiteDatabase, medicalStoryMapper);
         const objectiveRepo = new ObjectiveRepositoryImpl(expo as SQLiteDatabase, objectiveMapper);
         const patientMeasurementRepo = new PatientMeasurementRepositoryImpl(expo as SQLiteDatabase, patientMeasurementMapper);
         const personalAndSocialStoryRepo = new PersonalAndSocialStoryRepositoryImpl(expo as SQLiteDatabase, personalAndSocialMapper);
         const medicalRecordRepo = new MedicalRecordRepositoryImpl(expo as SQLiteDatabase, medicalRecodMapper, {
            consultationInfoRepo: consultationInfoRepo,
            foodDiaryRepo: foodDiaryRepo,
            foodStoryRepo: foodStoryRepo,
            medicalStoryRepo: medicalStoryRepo,
            personalAndSocialStoryRepo: personalAndSocialStoryRepo,
            patientMeasurementRepo: patientMeasurementRepo,
            objectiveRepo: objectiveRepo,
         });
         const getAllFoodDiaryUC = new GetAllFoodDiaryUseCase(medicalRecordRepo, medicalRecodMapper);

         MedicalRecordAPI.instance = new MedicalRecordDataProvider(getAllFoodDiaryUC)
      }
      return MedicalRecordAPI.instance as IMedicalRecordAPI;
   }
}
