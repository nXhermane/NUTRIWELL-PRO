import * as schemas from "../database/foodAndRecipe.schema";
import { FoodRepository } from "./interfaces/FoodRepository";
import { FoodRepositoryError, FoodRepositoryNotFoundException } from "./errors/FoodRepositoryError";
import { AggregateID, Mapper, Paginated } from "@shared";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import { Food } from "../../domain";
import { FoodNamePersistenceType, NutrientAmountPersitenceType } from "./types";
import { FoodDto } from "../dtos";
import { FoodGroupRepository } from "./interfaces/FoodGroupRepository";

export class FoodRepositoryImpl implements FoodRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<Food, FoodNamePersistenceType, FoodDto>,
      private foodGroupRepo: FoodGroupRepository,
   ) {
      this.db = drizzle(expo);
   }

   async save(food: Food): Promise<void> {
      try {
         const foodPersistence = this.mapper.toPersistence(food);
         const exist = await this.checkIfExist(foodPersistence.foodId);
         await this.db.transaction(async (tx) => {
            if (!exist) {
               await tx.insert(schemas.foodNames).values(foodPersistence);
            } else {
               await tx
                  .update(schemas.foodNames)
                  .set(foodPersistence)
                  .where(eq(schemas.foodNames.foodId, food.id as string));
            }
            this.foodGroupRepo.save(food.getProps().foodGroup, tx);
         });
      } catch (error: any) {
         throw new FoodRepositoryError("Erreur lors du sauvegarde du Food ", error as Error, { food });
      }
   }
   async delete(foodId: AggregateID, foodOrigin: string): Promise<void> {
      try {
         await this.db
            .delete(schemas.foodNames)
            .where(and(eq(schemas.foodNames.foodId, foodId as string), eq(schemas.foodNames.foodOrigin, foodOrigin)));
      } catch (error) {
         throw new FoodRepositoryError("Erreur lors de la suppression de Food", error as Error, { foodId, foodOrigin });
      }
   }

   async getById(foodId: AggregateID): Promise<Food> {
      try {
         const foodRow = await this.db
            .select()
            .from(schemas.foodNames)
            .where(eq(schemas.foodNames.foodId, foodId as string))
            .get();
         if (!foodRow)
            throw new FoodRepositoryNotFoundException("le food n'existe pas ", new Error("Le food pour l'id specifier n'eiste pas "), { foodId });
         const { groupId, ...otherProps } = foodRow;
         const foodGroup = await this.foodGroupRepo.getById(groupId);
         const food = {
            ...otherProps,
            foodGroup,
         };
         return this.mapper.toDomain(food);
      } catch (error) {
         throw new FoodRepositoryError("Erreur lors de la recuperation du Food", error as Error, { foodId });
      }
   }
   async getByFoodGroupId(foodGroupId: string, paginated?: Paginated): Promise<Food[]> {
      try {
         const query = this.db.select().from(schemas.foodNames).where(eq(schemas.foodNames.groupId, foodGroupId));
         if (paginated) query.limit(paginated.pageSize).offset(paginated.page);
         const foodRaws = await query;
         if (!foodRaws || foodRaws.length === 0) {
            throw new FoodRepositoryNotFoundException("No food found for the given group ID", new Error("Food of Specify foodGrpup doesn't exist"), {
               foodGroupId,
               paginated,
            });
         }
         const foods = await this.getFoodFromFoodRaws(foodRaws);
         return foods;
      } catch (error) {
         throw new FoodRepositoryError("Erreur lors de la recuperation de food pas foodgroupId", error as Error, {
            foodGroupId,
            paginated,
         });
      }
   }
   async getAllFood(foodOrigin?: string, paginated?: Paginated): Promise<Food[]> {
      try {
         const query = this.db.select().from(schemas.foodNames);
         if (foodOrigin) query.where(eq(schemas.foodNames.foodOrigin, foodOrigin));
         if (paginated) query.limit(paginated.pageSize).offset(paginated.page);
         const foodRaws = await query;
         if (!foodRaws || foodRaws.length === 0) {
            throw new FoodRepositoryNotFoundException("No food found for the given group ID", new Error("Food of Specify foodGrpup doesn't exist"), {
               foodOrigin,
               paginated,
            });
         }
         const foods = await this.getFoodFromFoodRaws(foodRaws);
         return foods;
      } catch (error) {
         throw new FoodRepositoryError("Erreur lors de la recuperation de food pas foodgroupId", error as Error, {
            foodOrigin,
            paginated,
         });
      }
   }
   async getAllFoodId(foodOrigin?: string): Promise<AggregateID[]> {
      try {
         const query = this.db
            .select({
               id: schemas.foodNames.foodId,
            })
            .from(schemas.foodNames);
         if (foodOrigin) query.where(eq(schemas.foodNames.foodOrigin, foodOrigin));
         const foodRaws = await query;
         if (!foodRaws || foodRaws.length === 0) {
            throw new FoodRepositoryNotFoundException("No food found for the given group ID", new Error("Food of Specify foodGrpup doesn't exist"), {
               foodOrigin,
            });
         }
         return foodRaws.map((value: { id: string }) => value.id as AggregateID);
      } catch (error) {
         throw new FoodRepositoryError("Erreur lors de la recuperation des id de tout les food ", error as Error, { foodOrigin });
      }
   }

   private async checkIfExist(foodId: AggregateID): Promise<boolean> {
      const food = await this.db
         .select()
         .from(schemas.foodNames)
         .where(eq(schemas.foodNames.foodId, foodId as string))
         .get();
      return !!food;
   }
   private async getFoodFromFoodRaws(foodRaws: FoodNamePersistenceRowType[]): Promise<Food[]> {
      return Promise.all(
         foodRaws.map(async (value: FoodNamePersistenceRowType) => {
            const { groupId, ...otherProps } = value;
            const foodGroup = await this.foodGroupRepo.getById(groupId as AggregateID);
            return this.mapper.toDomain({
               foodGroup,
               ...otherProps,
            });
         }),
      );
   }
}

type FoodNamePersistenceRowType = {
   groupId: string;
   foodId: string;
   foodCode: string | null;
   foodName: string | null;
   foodNameF: string | null;
   scientificName: string | null;
   foodSource: string | null;
   foodOrigin: string | null;
   foodNutrients: NutrientAmountPersitenceType[] | null;
};
