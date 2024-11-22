import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import ExpoSQLiteDialect from "@expo/knex-expo-sqlite-dialect";
import { IDatabase } from "@shared";

export default class Database implements IDatabase {
   public db: SQLiteDatabase | null = null;
   private static instance: Database;
   private constructor() {}
   private async downloadDb(): Promise<void> {
      if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")).exists) {
         await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
      }
      await FileSystem.downloadAsync(
         Asset.fromModule(require("./../../../databaseFiles/patient.sqlite")).uri,
         FileSystem.documentDirectory + "SQLite/PatientManager.sqlite",
      );
   }
   private async init(): Promise<void> {
      await this.downloadDb();
      if (!this.db) {
         this.db = await openDatabaseAsync("PatientManager.sqlite");
      } else this.db = Database.instance.db;
   }
   public static async getInstance(): Promise<IDatabase> {
      if (!Database.instance) {
         Database.instance = new Database();
         await Database.instance.init();
      }
      return Database.instance;
   }
}
export const db: Promise<IDatabase> = Database.getInstance();
