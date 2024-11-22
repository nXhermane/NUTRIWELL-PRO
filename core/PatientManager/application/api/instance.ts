import { SQLiteDatabase } from "expo-sqlite";
import { IPatientServiceDataProvider } from "./interfaces/PatientServiceDataProvider";
import { db } from "../../infrastructure/database/db.config";
import { PatientMapper, PatientRepositoryImplDb } from "../../infrastructure";
import { PatientServiceDataprovider } from "./PatientServicedataProvider";

export class PatientApi {
   private static instance: IPatientServiceDataProvider | null = null;
   static async getInstance(): Promise<IPatientServiceDataProvider> {
      if (PatientApi.instance) {
         const expo: SQLiteDatabase = (await db).db as SQLiteDatabase;
         const patientMappper = new PatientMapper();
         const patientRepo = new PatientRepositoryImplDb(expo, patientMappper);
         PatientApi.instance = new PatientServiceDataprovider(patientRepo, patientMappper);
      }
      return PatientApi.instance as IPatientServiceDataProvider;
   }
}
