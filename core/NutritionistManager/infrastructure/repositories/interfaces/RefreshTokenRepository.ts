import { AggregateID } from "@shared";

export interface RefreshTokenRepository {
   save(nutritionistId: AggregateID, token: string): Promise<void>;
   getById(nutritionistId: AggregateID): Promise<string>;
   delete(nutritionistId: AggregateID): Promise<void>;
}
