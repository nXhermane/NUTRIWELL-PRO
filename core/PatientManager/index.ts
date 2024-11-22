import { SQLiteDatabase } from "expo-sqlite";
import { CreatePatientUseCase, DeletePatientUseCase, GetAllPatientUseCase, GetPatientUseCase, IPatientService, PatientService } from "./application";
import { PatientMapper, PatientRepositoryImplDb } from "./infrastructure";
import { db } from "./infrastructure/database/db.config";
import { FileManagerExpo } from "@shared";

export type IPatientManager = IPatientService;

export class PatientManager {
   private static instance: IPatientManager | null = null;
   static async getInstance(): Promise<IPatientManager> {
      if (PatientManager.instance) {
         const expo = (await db).db;
         const patientMapper = new PatientMapper();
         const patientRepo = new PatientRepositoryImplDb(expo as SQLiteDatabase, patientMapper);
         const fileManager = new FileManagerExpo();
         const createPatientUC = new CreatePatientUseCase(patientRepo, fileManager);
         const getPatientUC = new GetPatientUseCase(patientRepo, patientMapper);
         const getAllPatientUC = new GetAllPatientUseCase(patientRepo, patientMapper);
         const deletePatientUC = new DeletePatientUseCase(patientRepo, fileManager);
         PatientManager.instance = new PatientService(createPatientUC, getPatientUC, getAllPatientUC, deletePatientUC);
      }

      return PatientManager.instance as IPatientManager;
   }
}
export * from "./application";
export * from "./domain";
export * from "./infrastructure";
