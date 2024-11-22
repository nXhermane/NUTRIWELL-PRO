import { INVALID_INGREDIENT_LIST, INVALID_PREPARATION_LIST, INVALID_COOKING_TIME } from "./../constants";

import {
   AggregateRoot,
   CreateEntityProps,
   EmptyStringError,
   ArgumentNotProvidedException,
   Guard,
   ExceptionBase,
   Result,
   IQuantity,
} from "@shared";
import { Ingredient, IIngredient } from "./../value-objects/Ingredient";
import { PreparationStep, IPreparationStep } from "./../value-objects/PreparationStep";
import { FoodQuantity } from "./../value-objects/Quantity";
import { MealsType, IMealsType } from "./../value-objects/MealsType";
import { MealsCategory, IMealsCategory } from "./../value-objects/MealsCategory";
import { CreateRecipeProps } from "../types";
export interface IRecipe {
   name: string;
   type: MealsType;
   category: MealsCategory;
   ingredients: Ingredient[];
   preparationMethod: PreparationStep[];
   cookingTime: number;
   quantity: FoodQuantity;
   description: string;
   author: string;
   nameTranslate?: {
      inFrench?: string;
      inEnglish?: string;
   };
}
export class Recipe extends AggregateRoot<IRecipe> {
   constructor(createFoodProps: CreateEntityProps<IRecipe>) {
      super(createFoodProps);
      this.validate();
   }
   get name(): string {
      return this.props.name;
   }
   get nameF(): string {
      return this.props?.nameTranslate?.inFrench ?? this.props.name;
   }
   get nameE(): string {
      return this.props?.nameTranslate?.inEnglish ?? this.props.name;
   }
   get type(): IMealsType {
      return this.props.type.unpack();
   }
   get category(): IMealsCategory {
      return this.props.category.unpack();
   }
   get quantity(): IQuantity {
      return this.props.quantity.unpack();
   }
   get description(): string {
      return this.props.description;
   }
   get ingredients(): IIngredient[] {
      return this.props.ingredients.map((ingredient: Ingredient) => ingredient.unpack());
   }
   get preparationMethod(): IPreparationStep[] {
      return this.props.preparationMethod.map((prepationStep: PreparationStep) => prepationStep.unpack());
   }
   get cookingTime(): number {
      return this.props.cookingTime;
   }
   get author(): string {
      return this.props.author;
   }
   set name(name: string) {
      this.props.name = name;
      this.validate();
   }
   set nameF(nameF: string) {
      this.props.nameTranslate = {
         ...this.props.nameTranslate,
         inFrench: nameF,
      };
      this.validate();
   }
   set nameE(nameE: string) {
      this.props.nameTranslate = {
         ...this.props.nameTranslate,
         inEnglish: nameE,
      };
      this.validate();
   }
   set category(category: MealsCategory) {
      this.props.category = category;
      this.validate();
   }
   set type(type: MealsType) {
      this.props.type = type;
      this.validate();
   }
   set author(author: string) {
      this.props.author = author;
      this.validate();
   }
   getTotalPreparationTime(): number {
      let totalPrepTime = this.props.cookingTime;
      for (const step of this.props.preparationMethod) {
         totalPrepTime += step.estimatedTime;
      }
      return totalPrepTime;
   }
   addPreparationStep(step: PreparationStep): void {
      this.props.preparationMethod.push(step);
      this.validate();
   }
   addIngredient(ingredient: Ingredient): void {
      this.props.ingredients.push(ingredient);
      this.validate();
   }
   updateCookingTime(newCookingTime: number): void {
      this.props.cookingTime = newCookingTime;
      this.validate();
   }
   updateQuantity(newQuantity: FoodQuantity): void {
      this.props.quantity = newQuantity;
      this.validate();
   }
   removeIngredient(ingredient: Ingredient): void {
      const index = this.props.ingredients.findIndex((ing: Ingredient) => ing.foodId === ingredient.foodId);
      if (index !== -1) {
         this.props.ingredients.splice(index, 1);
         this.validate();
      }
   }
   removePreparationStep(step: PreparationStep): void {
      const index = this.props.preparationMethod.findIndex((prepStep: PreparationStep) => prepStep.stepNumber === step.stepNumber);
      if (index !== -1) {
         this.props.preparationMethod.splice(index, 1);
         this.validate();
      }
   }
   validate(): void {
      const { ingredients, preparationMethod, cookingTime } = this.props;
      if (!ingredients || ingredients.length === 0) {
         throw new ArgumentNotProvidedException(INVALID_INGREDIENT_LIST);
      }
      if (!preparationMethod || preparationMethod.length === 0) {
         throw new ArgumentNotProvidedException(INVALID_PREPARATION_LIST);
      }
      if (cookingTime <= 0) {
         throw new Error(INVALID_COOKING_TIME);
      }
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError();
   }

   static async create(createRecipeProps: CreateRecipeProps): Promise<Result<Recipe>> {
      const { quantity, preparationMethod, category, type, ingredients, ...otherRecipeProps } = createRecipeProps;
      try {
         const newQuantity = FoodQuantity.create(quantity);
         if (newQuantity.isFailure) return Result.fail<Recipe>(`[Error]: ${(newQuantity.err as any)?.toJSON() || newQuantity.err}`);
         const ingredientResults = await Promise.all(
            ingredients.map(async (value: Omit<IIngredient, "quantity"> & { quantity: IQuantity }) => await Ingredient.create(value)),
         );
         const preparationStepResult = preparationMethod.map((value: IPreparationStep) => new PreparationStep(value));
         const mealsCategory = new MealsCategory(category);
         const mealsType = new MealsType(type);
         const validateResult = Result.combine(ingredientResults);
         if (validateResult.isFailure) return Result.fail<Recipe>(`[Error]: ${(validateResult.err as any)?.toJSON() || validateResult.err}`);
         const recipe = new Recipe({
            props: {
               quantity: newQuantity.val,
               category: mealsCategory,
               type: mealsType,
               preparationMethod: preparationStepResult,
               ingredients: ingredientResults.map((value: Result<Ingredient>) => value.val),
               ...otherRecipeProps,
            },
         });
         return Result.ok<Recipe>(recipe);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Recipe>(`[${error.code}]:${error.message}`)
            : Result.fail<Recipe>(`Erreur inattendue. ${Recipe.constructor.name}`);
      }
   }
}
