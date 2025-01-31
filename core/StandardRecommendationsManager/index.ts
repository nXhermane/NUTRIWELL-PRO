import { SQLiteDatabase } from "expo-sqlite";
import {
   AddHealthIndicatorToStandardMedicalConditionUseCase,
   AddRecommendationToStandardMedicalConditionUseCase,
   AddRecommendationToStandardObjectiveUseCase,
   CreateStandardMedicalConditionUseCase,
   CreateStandardObjectiveUseCase,
   DeleteStandardMedicalConditionUseCase,
   DeleteStandardObjectiveUseCase,
   GetStandardMedicalConditionUseCase,
   GetStandardObjectiveUseCase,
   IStandardMedicalConditionService,
   IStandardObjectiveService,
   RemoveHealthIndicatorFromStandardMedicalConditionUseCase,
   RemoveRecommendationFromStandardMedicalConditionUseCase,
   RemoveRecommendationFromStandardObjectiveUseCase,
   StandardMedicalConditionService,
   StandardObjectiveService,
   UpdateStandardMedicalConditionUseCase,
   UpdateStandardObjectiveUseCase,
} from "./application";
import {
   StandardMedicalConditionMapper,
   StandardMedicalConditionRepositoryImpl,
   StandardObjectiveMapper,
   StandardObjectiveRepositoryImpl,
} from "./infrastructure";
import { db } from "./infrastructure/database/db.config";

export interface IStandardRecommendationsManager {
   standardMedicalCondition: IStandardMedicalConditionService;
   standardObjective: IStandardObjectiveService;
}

export class StandardRecommendationsManager {
   private static instance: IStandardRecommendationsManager | null;
   static async getIntance(): Promise<IStandardRecommendationsManager> {
      if (!StandardRecommendationsManager.instance) {
         // Database instance
         const expo = (await db).db;
         // Mappers
         const medicalConditionMapper = new StandardMedicalConditionMapper();
         const objectiveMapper = new StandardObjectiveMapper();
         // Repositories
         const medicalConditionRepo = new StandardMedicalConditionRepositoryImpl(expo as SQLiteDatabase, medicalConditionMapper);
         const objectiveRepo = new StandardObjectiveRepositoryImpl(expo as SQLiteDatabase, objectiveMapper);
         // UseCases
         // MedicalCondition UseCases
         const createMedicalConditionUC = new CreateStandardMedicalConditionUseCase(medicalConditionRepo);
         const deleteMedicalConditionUC = new DeleteStandardMedicalConditionUseCase(medicalConditionRepo);
         const getMedicalConditionUC = new GetStandardMedicalConditionUseCase(medicalConditionRepo, medicalConditionMapper);
         const updateMedicalConditionUC = new UpdateStandardMedicalConditionUseCase(medicalConditionRepo);
         const addRecommendationToMedicalConditionUC = new AddRecommendationToStandardMedicalConditionUseCase(medicalConditionRepo);
         const addHealthIndicatorToMedicalConditionUC = new AddHealthIndicatorToStandardMedicalConditionUseCase(medicalConditionRepo);
         const removeRecommendationFromMedicalConditionUC = new RemoveRecommendationFromStandardMedicalConditionUseCase(medicalConditionRepo);
         const removeHealthIndicatorFromMedicalConditionUC = new RemoveHealthIndicatorFromStandardMedicalConditionUseCase(medicalConditionRepo);
         // Objective UseCases
         const createObjectiveUC = new CreateStandardObjectiveUseCase(objectiveRepo);
         const deleteObjectiveUC = new DeleteStandardObjectiveUseCase(objectiveRepo);
         const getObjectiveUC = new GetStandardObjectiveUseCase(objectiveRepo, objectiveMapper);
         const updateObjectiveUC = new UpdateStandardObjectiveUseCase(objectiveRepo);
         const addRecommendationToObjectiveUC = new AddRecommendationToStandardObjectiveUseCase(objectiveRepo);
         const removeRecommendationFromObjectiveUC = new RemoveRecommendationFromStandardObjectiveUseCase(objectiveRepo);
         // Application Services
         const standardMedicaltConditionService = new StandardMedicalConditionService({
            createMedicalConditonUC: createMedicalConditionUC,
            delelteMedicalConditionUC: deleteMedicalConditionUC,
            getMedicalConditionUC: getMedicalConditionUC,
            updateMedicalConditionUC: updateMedicalConditionUC,
            addRecommendationUC: addRecommendationToMedicalConditionUC,
            addHealthIndicatorUC: addHealthIndicatorToMedicalConditionUC,
            removeHealthIndicatorUC: removeHealthIndicatorFromMedicalConditionUC,
            removeRecommendationUC: removeRecommendationFromMedicalConditionUC,
         });
         const standardObjectiveService = new StandardObjectiveService({
            createObjectiveUC: createObjectiveUC,
            deleteObjectiveUC: deleteObjectiveUC,
            getObjectiveUC: getObjectiveUC,
            updateObjectiveUC: updateObjectiveUC,
            addRecommendationUC: addRecommendationToObjectiveUC,
            removeRecommendationUC: removeRecommendationFromObjectiveUC,
         });

         StandardRecommendationsManager.instance = {
            standardMedicalCondition: standardMedicaltConditionService,
            standardObjective: standardObjectiveService,
         };
      }
      return StandardRecommendationsManager.instance;
   }
}
