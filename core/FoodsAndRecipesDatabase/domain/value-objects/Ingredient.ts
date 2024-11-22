import { INVALID_FOOD_REFERENCE_ERROR, EMPTY_FOOD_REFERENCE_ERROR } from "./../constants";
import { ValueObject, InvalidReference, Guard, ExceptionBase, Result, IQuantity } from "@shared";
import { FoodQuantity } from "./Quantity";
import { AggregateID, EmptyStringError } from "@shared";
import { FoodAndRecipeApi } from "../../application/api/instance";
export interface IIngredient {
   name: string;
   quantity: FoodQuantity;
   foodId: AggregateID;
}
export class Ingredient extends ValueObject<IIngredient> {
   constructor(props: IIngredient) {
      super(props);
   }
   get name(): string {
      return this.props.name;
   }
   get foodId(): AggregateID {
      return this.props.foodId;
   }
   get quantity(): IQuantity {
      return this.props.quantity.unpack();
   }

   validateIngredient(foodIds: AggregateID[]): void {
      if (!foodIds.includes(this.props.foodId)) {
         throw new InvalidReference(INVALID_FOOD_REFERENCE_ERROR);
      }
   }
   validate(props: IIngredient) {
      if (Guard.isEmpty(props.foodId).succeeded) {
         throw new EmptyStringError(EMPTY_FOOD_REFERENCE_ERROR);
      }
   }
   static async create(props: Omit<IIngredient, "quantity"> & { quantity: IQuantity }): Promise<Result<Ingredient>> {
      try {
         const newQuantity = FoodQuantity.create(props.quantity);
         if (newQuantity.isFailure) return Result.fail<Ingredient>(`[Error]: ${(newQuantity.err as any)?.toJSON() || newQuantity.err}`);
         const ingredient = new Ingredient({ ...props, quantity: newQuantity.val });
         const foodIds = await (await FoodAndRecipeApi.getInstance()).getAllFoodIds();
         const validateResult = Result.encapsulate<boolean>((): boolean => {
            ingredient.validateIngredient(foodIds);
            return true;
         });
         if (validateResult.isFailure) return Result.fail<Ingredient>(`[Error]: ${(validateResult.err as any)?.toJSON() || validateResult.err}`);
         return Result.ok<Ingredient>(ingredient);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Ingredient>(`[${error.code}]:${error.message}`)
            : Result.fail<Ingredient>(`Erreur inattendue. ${Ingredient.constructor.name}`);
      }
   }
}
