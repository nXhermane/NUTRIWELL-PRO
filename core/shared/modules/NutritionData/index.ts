import {
   IMeasurementTypeService,
   CreateMeasurementTypeUseCase,
   DeleteMeasurementTypeUseCase,
   GetAllMeasurementTypeUseCase,
   GetAllMeasurementTypeIdUseCase,
   GetMeasurementTypeUseCase,
   MeasurementTypeService,
} from "./application";
import { MeasurementTypeRepositoryImplDb, MeasurementTypeDto } from "./infrastructure";
import { db } from "./infrastructure/database/db.config";
import { SQLiteDatabase } from "expo-sqlite";
export interface INutritionData {
   measurement: IMeasurementTypeService;
}
export class NutritionData {
   private static instance: INutritionData | null = null;
   static async getInstance(): Promise<INutritionData> {
      if (NutritionData.instance) {
         const expo = (await db).db;

         const measurementRepo = new MeasurementTypeRepositoryImplDb(expo as SQLiteDatabase);

         const createMeasureUC = new CreateMeasurementTypeUseCase(measurementRepo);
         const getMeasureUC = new GetMeasurementTypeUseCase(measurementRepo);
         const getAllMeasureUC = new GetAllMeasurementTypeUseCase(measurementRepo);
         const getAllMeasureIdUC = new GetAllMeasurementTypeIdUseCase(measurementRepo);
         const deleteMeasureUC = new DeleteMeasurementTypeUseCase(measurementRepo);

         const measurementService = new MeasurementTypeService(createMeasureUC, getMeasureUC, getAllMeasureUC, getAllMeasureIdUC, deleteMeasureUC);

         NutritionData.instance = {
            measurement: measurementService,
         };
      }
      return NutritionData.instance as INutritionData;
   }
}
export { MeasurementTypeDto };
