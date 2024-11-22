import { Nutritionist } from "./../../../domain";
import { AggregateID, Paginated, Email } from "@shared";

export interface NutritionistRepository {
   save(nutritionist: Nutritionist, trx?: any): Promise<void>;
   getById(nutritionistId: AggregateID): Promise<Nutritionist>;
   getByEmail(nutritionistEmail: Email): Promise<Nutritionist>;
   delete(nutritionistId: AggregateID, trx?: any): Promise<void>;
   savePasswordHash(nutritionistId: AggregateID, passwordHash: string, trx?: any): Promise<void>;
   getPasswordHash(nutritionistId: AggregateID): Promise<string | null>;
   saveGoogleId(nutritionistId: AggregateID, googleId: string, trx?: any): Promise<void>;
   getGoogleId(nutrtionistId: AggregateID): Promise<string | null>;
}
