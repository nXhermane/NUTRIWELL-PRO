import { refreshTokens } from "./../database/nutritionist.schema";
import { AggregateID } from "@shared";
import { RefreshTokenRepository } from "./interfaces";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq, or } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { RefreshTokenRepositoryError, RefreshTokenRepositoryNotFoundException } from "./errors/RefreshTokenRepositoryErrors";
export class RefreshTokenRepositoryImplDb implements RefreshTokenRepository {
   private db;

   constructor(expo: SQLiteDatabase) {
      this.db = drizzle(expo);
   }

   async save(nutritionistId: AggregateID, token: string): Promise<void> {
      try {
         await this.db.insert(refreshTokens).values({ nutritionistId, token });
      } catch (e: any) {
         throw new RefreshTokenRepositoryError("Une erreur lors du sauvegarde du refresh token.");
      }
   }
   async getById(nutritionistId: AggregateID): Promise<string> {
      try {
         const token = await this.db
            .select({ token: refreshTokens.token })
            .from(refreshTokens)
            .where(eq(refreshTokens.nutritionistId, nutritionistId))
            .get();
         if (!token) throw new RefreshTokenRepositoryNotFoundException("Token non trouver pour l'utilisateur.", e as Error, { nutritionistId });

         return token.token;
      } catch (e: any) {
         throw new RefreshTokenRepositoryError("Erreur lors de la recuperation du refresh token", e as Error, { nutritionistId });
      }
   }
   async delete(nutritionistId: AggregateID): Promise<void> {
      try {
         await this.db.delete(refreshTokens).where(eq(refreshTokens.nutritionistId, nutritionistId));
      } catch (e: any) {
         throw new RefreshTokenRepositoryError("Erreur lors de la suppression du refresh Token", e as Error, { nutritionistId });
      }
   }
}
