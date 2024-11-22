import { SQLiteDatabase } from "expo-sqlite";
import { RecipeRepository } from "./interfaces/RecipeRepository";
import { AggregateID, IQuantity, Mapper, Paginated } from "@shared";
import { IMealsCategory, IMealsType, IPreparationStep, Recipe } from "../../domain";
import { IngredientType, RecipePersistenceType } from "./types";
import { RecipeDto } from "../dtos";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { RecipeRepositoryError, RecipeRepositoryNotFoundException } from "./errors/RecipeRepositoryError";
import { mealsCategories, mealsTypes, recipes } from "../database/foodAndRecipe.schema";
import { eq } from "drizzle-orm";

export class RecipeRepositoryImpl implements RecipeRepository {
   private db;
   constructor(
      expo: SQLiteDatabase,
      private mapper: Mapper<Recipe, RecipePersistenceType, RecipeDto>,
   ) {
      this.db = drizzle(expo);
   }
   async save(recipe: Recipe): Promise<void> {
      try {
         const persistenceRecipe = this.mapper.toPersistence(recipe);
         await this.db.transaction(async (tx) => {
            const exist = await this.checkIfExist(recipe.id);
            if (!exist) await (tx || this.db).insert(recipes).values(persistenceRecipe);
            else
               await (tx || this.db)
                  .update(recipes)
                  .set(persistenceRecipe)
                  .where(eq(recipes.recipeId, recipe.id as string));
            await this.saveCategory(recipe.category, tx);
            await this.saveType(recipe.type, tx);
         });
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors du sauvegarde du recipe ", error as Error, { recipe });
      }
   }
   async delete(recipeId: AggregateID): Promise<void> {
      try {
         await this.db.delete(recipes).where(eq(recipes.recipeId, recipeId as string));
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la suppression du recipe ", error as Error, {
            recipeId,
         });
      }
   }
   async getRecipeById(recipeId: AggregateID): Promise<Recipe> {
      try {
         const recipeRow = await this.db
            .select()
            .from(recipes)
            .where(eq(recipes.recipeId, recipeId as string))
            .get();
         if (!recipeRow) throw new RecipeRepositoryNotFoundException("Recipe non trouver avec l'id", new Error(), { recipeId });
         const { categoryId, typeId, ...otherProps } = recipeRow;
         const typeAndCategory = await this.getTypeAndCategory(typeId, categoryId);
         return this.mapper.toDomain({ ...otherProps, ...typeAndCategory });
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la recperation du Recipe", error as Error, {
            recipeId,
         });
      }
   }
   async getAllRecipe(paginated?: Paginated): Promise<Recipe[]> {
      try {
         const query = this.db.select().from(recipes);
         if (paginated) query.limit(paginated.pageSize).offset(paginated.page);
         const recipeRows = await query;
         if (!recipeRows) throw new RecipeRepositoryNotFoundException("Recipe n'exist pas", new Error(), { paginated });
         return await Promise.all(
            recipeRows.map(async (value: RecipePersistenceRecordType) => {
               const { typeId, categoryId, ...otherProps } = value;
               const typeAndCategory = await this.getTypeAndCategory(typeId, categoryId);
               return this.mapper.toDomain({
                  ...otherProps,
                  ...typeAndCategory,
               });
            }),
         );
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la recupperation  du Recipe", error as Error, { paginated });
      }
   }
   async getAllRecipeId(): Promise<AggregateID[]> {
      try {
         const recipeRows = await this.db.select({ id: recipes.recipeId }).from(recipes).all();
         return recipeRows.map((value: { id: string }) => value.id);
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la recupperation  du Recipe", error as Error);
      }
   }
   async getRecipeType(typeId: AggregateID): Promise<IMealsType> {
      try {
         const type = await this.db
            .select()
            .from(mealsTypes)
            .where(eq(mealsTypes.typeId, typeId as string))
            .get();
         return type as IMealsType;
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la recuperation du meals type", error as Error, { typeId });
      }
   }
   async getRecipeCategory(categoryId: AggregateID): Promise<IMealsCategory> {
      try {
         const category = await this.db
            .select()
            .from(mealsCategories)
            .where(eq(mealsCategories.categoryId, categoryId as string))
            .get();
         return category as IMealsCategory;
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la recuperation du meals type", error as Error, { categoryId });
      }
   }
   async getAllRecipeType(): Promise<IMealsType[]> {
      try {
         const types = await this.db.select().from(mealsTypes).all();
         return types as IMealsType[];
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la recuperation des meals type ", error as Error);
      }
   }
   async getAllRecipeCategory(): Promise<IMealsCategory[]> {
      try {
         const categories = await this.db.select().from(mealsCategories).all();
         return categories as IMealsCategory[];
      } catch (error) {
         throw new RecipeRepositoryError("Erreur lors de la recuperation des meals category", error as Error);
      }
   }
   private async checkIfExist(recipeId: AggregateID): Promise<boolean> {
      const recipe = await this.db
         .select()
         .from(recipes)
         .where(eq(recipes.recipeId, recipeId as string))
         .get();
      return !!recipe;
   }
   private async saveCategory(category: IMealsCategory, trx: any): Promise<void> {
      const exist = await this.checkIfCategoryExist(category.categoryId);
      if (!exist) await this.db.insert(mealsCategories).values({ ...category, categoryId: category.categoryId as string });
      else
         await this.db
            .update(mealsCategories)
            .set({ ...category, categoryId: category.categoryId as string })
            .where(eq(mealsCategories.categoryId, category.categoryId as string));
   }

   private async saveType(type: IMealsType, trx: any): Promise<void> {
      const exist = await this.checkIfTypeExist(type.typeId);
      if (!exist) await this.db.insert(mealsTypes).values({ ...type, typeId: type.typeId as string });
      else
         await this.db
            .update(mealsTypes)
            .set({ ...type, typeId: type.typeId as string })
            .where(eq(mealsTypes.typeId, type.typeId as string));
   }
   private async checkIfCategoryExist(categoryId: AggregateID): Promise<boolean> {
      const category = await this.db
         .select()
         .from(mealsCategories)
         .where(eq(mealsCategories.categoryId, categoryId as string))
         .get();
      return !!category;
   }
   private async checkIfTypeExist(typeId: AggregateID): Promise<boolean> {
      const type = await this.db
         .select()
         .from(mealsTypes)
         .where(eq(mealsTypes.typeId, typeId as string))
         .get();
      return !!type;
   }
   private async getTypeAndCategory(typeId: AggregateID, categoryId: AggregateID): Promise<{ type: IMealsType; category: IMealsCategory }> {
      const type = await this.getRecipeType(typeId);
      const category = await this.getRecipeCategory(categoryId);
      return { type, category };
   }
}

type RecipePersistenceRecordType = {
   recipeId: string;
   name: string | null;
   nameF: string | null;
   categoryId: string;
   typeId: string;
   ingredients: IngredientType[] | null;
   preparationMethod: IPreparationStep[] | null;
   cookingTime: number | null;
   quantity: IQuantity | null;
   description: string | null;
};
