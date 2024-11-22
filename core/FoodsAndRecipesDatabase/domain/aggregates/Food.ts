import {
   INVALID_FOOD_CODE_ERROR,
   INVALID_FOOD_NAME_ERROR,
   INVALID_FOOD_ORIGIN_ERROR,
   DUPLICATE_NUTRIENTS_ERROR,
   FOOD_UPDATE_RESTRICTED_ERROR,
} from "./../constants";

import { FoodQuantity } from "./../value-objects/Quantity";
import { FoodGroup, IFoodGroup } from "./../entities/FoodGroup";
import {
   AggregateRoot,
   CreateEntityProps,
   BaseEntityProps,
   EmptyStringError,
   DuplicateValueError,
   AuthValueError,
   Guard,
   Result,
   ExceptionBase,
   IQuantity,
} from "@shared";
import { CreateFoodProps } from "../types";
import { INutrientAmount, NutrientAmount } from "../value-objects/NutrientAmount";

export interface IFood {
   foodCode: string;
   foodName: string;
   foodOrigin: string;
   foodSource: string;
   foodQuantity: FoodQuantity;
   foodGroup: FoodGroup;
   foodNameTranslate?: {
      inFrench?: string;
      inEnglish?: string;
   };
   foodNutrients: NutrientAmount[];
}

export class Food extends AggregateRoot<IFood> {
   constructor(createFoodProps: CreateEntityProps<IFood>) {
      super(createFoodProps);
      this.validate();
   }
   get foodCode(): string {
      return this.props.foodCode;
   }
   get foodName(): string {
      return this.props.foodName;
   }
   get foodOrigin(): string {
      return this.props.foodOrigin;
   }
   get foodSource(): string {
      return this.props.foodSource;
   }
   get foodQuantity(): IQuantity {
      return this.props.foodQuantity.unpack();
   }
   get foodGroup(): IFoodGroup & BaseEntityProps {
      return this.props.foodGroup.getProps();
   }
   get foodNutrients(): INutrientAmount[] {
      return this.props.foodNutrients.map((nutrient: NutrientAmount) => nutrient.unpack());
   }
   get foodNameF(): string {
      return this.props?.foodNameTranslate?.inFrench ?? this.props.foodName;
   }
   get foodNameE(): string {
      return this.props?.foodNameTranslate?.inEnglish ?? this.props.foodName;
   }
   set foodNameF(value: string) {
      this.verifyIfFoodCanBeUpdate();
      this.props.foodNameTranslate = {
         ...this.props.foodNameTranslate,
         inFrench: value,
      };
   }
   set foodNameE(value: string) {
      this.verifyIfFoodCanBeUpdate();
      this.props.foodNameTranslate = {
         ...this.props.foodNameTranslate,
         inEnglish: value,
      };
   }
   addNutrientsToFood(...nutrientAmounts: INutrientAmount[]): Result<boolean> {
      let addResult: Result<boolean>[] = [] as Result<boolean>[];
      nutrientAmounts.forEach((value: INutrientAmount) => {
         this.verifyIfFoodCanBeUpdate();
         const nutrient = new NutrientAmount(value);
         const existingNutrientIndex = this.findExistingNutrientIndex(nutrient);
         if (existingNutrientIndex !== -1) {
            this.props.foodNutrients[existingNutrientIndex] = nutrient;
         } else {
            this.props.foodNutrients.push(nutrient);
         }
         if (!this.validateNutrientIsUnique(this.props.foodNutrients)) {
            addResult.push(Result.fail<boolean>("the duplicated nutrient "));
            return;
         }
         addResult.push(Result.ok<boolean>(true));
      });
      return Result.combine(addResult);
   }
   validate(): void {
      if (Guard.isEmpty(this.props.foodCode).succeeded) {
         throw new EmptyStringError(INVALID_FOOD_CODE_ERROR);
      }
      if (Guard.isEmpty(this.props.foodName).succeeded) {
         throw new EmptyStringError(INVALID_FOOD_NAME_ERROR);
      }
      if (Guard.isEmpty(this.props.foodOrigin).succeeded) {
         throw new EmptyStringError(INVALID_FOOD_ORIGIN_ERROR);
      }
      this.props.foodGroup.validate();

      // TODO: je dois reactiver cela plus tart quand les données seront prestes
      // if (this.props.foodNutrients.length < 5) {
      //             throw new Error(MINIMUM_NUTRIENTS_ERROR);
      //         }
      if (!this.validateNutrientIsUnique(this.props.foodNutrients)) {
         throw new DuplicateValueError(DUPLICATE_NUTRIENTS_ERROR);
      }
      this._isValid = true;
   }
   private validateNutrientIsUnique(foodNutrients: NutrientAmount[]): boolean {
      const nutrientSetArray = new Set();
      for (const nutrient of foodNutrients) {
         const key = JSON.stringify(nutrient.unpack().nutrientId);
         if (nutrientSetArray.has(key)) {
            return false;
         }
         nutrientSetArray.add(key);
      }
      return true;
   }
   /**
    * @Note : L'aliment du systeme ne peut pas etre modifier sauf ceux ajouter par l'utilisateur lui meme
    *
    */

   private verifyIfFoodCanBeUpdate() {
      if (this.props.foodOrigin.trim() != "me") throw new AuthValueError(FOOD_UPDATE_RESTRICTED_ERROR);
   }

   private findExistingNutrientIndex(newNutrient: NutrientAmount): number {
      return this.props.foodNutrients.findIndex((nutrient) => {
         return nutrient.unpack().nutrientId === newNutrient.unpack().nutrientId;
      });
   }
   static create(createFoodProps: CreateFoodProps): Result<Food> {
      const { foodQuantity, foodGroup, foodNutrients, ...otherProps } = createFoodProps;
      try {
         const newQuantity = FoodQuantity.create(foodQuantity);
         if (newQuantity.isFailure) return Result.fail<Food>(`[Error]: ${(newQuantity.err as any)?.toJSON() || newQuantity.err}`);
         const newFoodGroup = new FoodGroup(createFoodProps.foodGroup);
         const nutrientAmountResult = foodNutrients.map((value: INutrientAmount) => NutrientAmount.create(value));
         const validateResult = Result.combine(nutrientAmountResult);
         if (validateResult.isFailure) return Result.fail<Food>(`[Error]: ${(validateResult.err as any)?.toJSON() || validateResult.err}`);
         const food = new Food({
            props: {
               foodGroup: newFoodGroup,
               foodQuantity: newQuantity.val,
               foodNutrients: nutrientAmountResult.map((value: Result<NutrientAmount>) => value.val),
               ...otherProps,
            },
         });
         return Result.ok<Food>(food);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Food>(`[${error.code}]:${error.message}`)
            : Result.fail<Food>(`Erreur inattendue. ${Food.constructor.name}`);
      }
   }
}
