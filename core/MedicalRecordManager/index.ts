import { SQLiteDatabase } from "expo-sqlite";
import { IMedicalRecordService, MedicalRecordService } from "./application/services";
import {
   ConsultationInformationRepositoryImpl,
   FoodDiaryRepositoryImpl,
   FoodStoryRepositoryImpl,
   MedicalRecordRepositoryImpl,
   MedicalStoryRepositoryImpl,
   ObjectiveRepositoryImpl,
   PatientMeasurementRepositoryImpl,
   PersonalAndSocialStoryRepositoryImpl,
} from "./infrastructure";
import { db } from "./infrastructure/database/db.config";
import { ConsultationInformationMapper } from "./infrastructure/mappers/ConsultationInformationMapper";
import { FoodDiaryMapper } from "./infrastructure/mappers/FoodDiaryMapper";
import { FoodStoryMapper } from "./infrastructure/mappers/FoodStoryMapper";
import { MedicalStoryMapper } from "./infrastructure/mappers/MedicalStoryMapper";
import { ObjectiveMapper } from "./infrastructure/mappers/ObjectiveMapper";
import { PersonalAndSocialStoryMapper } from "./infrastructure/mappers/PersonalAndSocialStoryMapper";
import { MedicalRecordMapper } from "./infrastructure/mappers/MedicalRecordMapper";
import { PatientMeasurementMapper } from "./infrastructure/mappers/PatientMeasurementMapper";
import {
   AddMeasurementUseCase,
   CreateEatingBehaviorUseCase,
   CreateFoodDiaryUseCase,
   CreateMedicalRecordUseCase,
   CreateObjectiveUseCase,
   DeleteMedicalRecordUseCase,
   GetAllFoodDiaryUseCase,
   GetAllObjectiveUseCase,
   GetConsultationInformationUseCase,
   GetFoodDiaryUseCase,
   GetFoodStoryUseCase,
   GetMedicalStoryUseCase,
   GetObjectiveUseCase,
   GetPersonalAndSocialStoryUseCase,
   UpdateConsultationInformationUseCase,
   UpdateFoodDiaryUseCase,
   UpdateFoodStoryUseCase,
   UpdateMedicalStoryUseCase,
} from "./application/useCases";
import { FileManagerExpo } from "../shared";
import { AfterPatientCreatedEvent, AfterPatientDeletedEvent } from "./application/subscribers";

export interface IMedicalRecordManager extends IMedicalRecordService {}
export class MedicalRecordManager {
   private static instance: IMedicalRecordManager | null = null;
   static async getInstance(): Promise<IMedicalRecordManager> {
      if (MedicalRecordManager.instance) {
         const expo = (await db).db;
         const fileManager = new FileManagerExpo();
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
         const addMeasureUC = new AddMeasurementUseCase(medicalRecordRepo);
         const createEatingBehaviorUC = new CreateEatingBehaviorUseCase(medicalRecordRepo);
         const createFoodDiaryUC = new CreateFoodDiaryUseCase(medicalRecordRepo, fileManager);
         const createMedicalRecordUC = new CreateMedicalRecordUseCase(medicalRecordRepo);
         const createObjectiveUC = new CreateObjectiveUseCase(medicalRecordRepo);
         const deleteMedicalRecordUC = new DeleteMedicalRecordUseCase(medicalRecordRepo);
         const getAllFoodDiaryUC = new GetAllFoodDiaryUseCase(medicalRecordRepo, medicalRecodMapper);
         const getAllObjectiveUC = new GetAllObjectiveUseCase(medicalRecordRepo, medicalRecodMapper);
         const getConsultInfoUC = new GetConsultationInformationUseCase(medicalRecordRepo, medicalRecodMapper);
         const getFoodDiaryUC = new GetFoodDiaryUseCase(medicalRecordRepo, medicalRecodMapper);
         const getFoodStoryUC = new GetFoodStoryUseCase(medicalRecordRepo, medicalRecodMapper);
         const getMedicalStoryUC = new GetMedicalStoryUseCase(medicalRecordRepo, medicalRecodMapper);
         const getObjectiveUC = new GetObjectiveUseCase(medicalRecordRepo, medicalRecodMapper);
         const getPersonalAndSocialStoryUC = new GetPersonalAndSocialStoryUseCase(medicalRecordRepo, medicalRecodMapper);
         const updateConsultInfoUC = new UpdateConsultationInformationUseCase(medicalRecordRepo);
         const updateFoodDiaryUC = new UpdateFoodDiaryUseCase(medicalRecordRepo, fileManager);
         const updateFoodStoryUC = new UpdateFoodStoryUseCase(medicalRecordRepo);
         const updateMedicalStoryUC = new UpdateMedicalStoryUseCase(medicalRecordRepo);

         // Initialise  sucribers for event 
         const afterPatietnCreatedEvent =  new AfterPatientCreatedEvent(createMedicalRecordUC)
         const afterPatientDeletedEvent = new AfterPatientDeletedEvent(deleteMedicalRecordUC)
         
         MedicalRecordManager.instance = new MedicalRecordService(
            addMeasureUC,
            createMedicalRecordUC,
            deleteMedicalRecordUC,
            createEatingBehaviorUC,
            createFoodDiaryUC,
            createObjectiveUC,
            getAllFoodDiaryUC,
            getAllObjectiveUC,
            getConsultInfoUC,
            getFoodDiaryUC,
            getFoodStoryUC,
            getMedicalStoryUC,
            getObjectiveUC,
            getPersonalAndSocialStoryUC,
            updateConsultInfoUC,
            updateFoodDiaryUC,
            updateFoodStoryUC,
            updateMedicalStoryUC,
         );
      }
      return MedicalRecordManager.instance as IMedicalRecordManager;
   }
}

