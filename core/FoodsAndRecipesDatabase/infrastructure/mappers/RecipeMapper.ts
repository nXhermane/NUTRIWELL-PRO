import { Mapper } from "@shared";
import { Recipe, MealsType, MealsCategory, Ingredient, IIngredient, FoodQuantity, PreparationStep } from "./../../domain";

import { RecipeDto } from "./../dtos";
import { IngredientType, PreparationStepType, RecipePersistenceRecordType, RecipePersistenceType } from "../repositories";
export class RecipeMapper implements Mapper<Recipe, RecipePersistenceType, RecipeDto> {
   toPersistence(entity: Recipe): RecipePersistenceType {
      const recipePersistence: RecipePersistenceType = {
         recipeId: entity.id as string,
         name: entity.name,
         nameF: entity.nameF,
         categoryId: entity.category.categoryId as string,
         typeId: entity.type.typeId as string,
         ingredients: entity.ingredients.map((value: IIngredient) => ({
            ...value,
            quantity: value.quantity.unpack(),
         })),
         preparationMethod: entity.preparationMethod,
         cookingTime: entity.cookingTime,
         quantity: entity.quantity,
         description: entity.description,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         author: entity.author,
      };
      return recipePersistence;
   }
   toDomain(record: RecipePersistenceRecordType): Recipe {
      const quantity = new FoodQuantity(record.quantity);
      const ingredients = record.ingredients.map((value: IngredientType) => {
         const newQuantity = new FoodQuantity(value.quantity);
         return new Ingredient({
            ...value,
            quantity: newQuantity,
         });
      });
      const preparationMethod = record.preparationMethod.map((value: PreparationStepType) => new PreparationStep(value));
      const type = new MealsType(record.type);
      const category = new MealsCategory(record.category);
      const recipe = new Recipe({
         id: record.recipeId,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            cookingTime: record.cookingTime,
            description: record.description,
            author: record.author,
            name: record.name,
            nameTranslate: {
               inFrench: record.nameF,
            },
            quantity,
            ingredients,
            preparationMethod,
            type,
            category,
         },
      });
      return recipe;
   }
   toResponse(entity: Recipe): RecipeDto {
      const dto: RecipeDto = {
         id: entity.id,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         name: entity.name,
         nameF: entity.nameF,
         cookingTime: entity.cookingTime,
         description: entity.description,
         author: entity.author,
         quantity: entity.quantity,
         ingredients: entity.ingredients.map((value: IIngredient) => ({
            ...value,
            quantity: value.quantity.unpack(),
         })),
         preparationMethod: entity.preparationMethod,
         type: entity.type,
         category: entity.category,
      };
      return dto;
   }
}
