import { INVALID_QUANTITY_UNIT_ERROR, NEGATIVE_QUANTITY_ERROR } from "./../constants";
import { ValueObject, FoodQuantityUnits, Guard, IQuantity, Result, ExceptionBase } from "@shared";

export class FoodQuantity extends ValueObject<IQuantity> {
   constructor(props: IQuantity) {
      super(props);
      this.validate(props);
   }

   validate(props: IQuantity): void {
      if (!FoodQuantityUnits.includes(props.unit)) throw new Error(INVALID_QUANTITY_UNIT_ERROR(FoodQuantityUnits.join(",")));

      if (Guard.isNegative(props.value).succeeded) {
         throw new Error(NEGATIVE_QUANTITY_ERROR);
      }
   }
   static create(props: IQuantity): Result<FoodQuantity> {
      try {
         const quantity = new FoodQuantity(props);
         return Result.ok<FoodQuantity>(quantity);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<FoodQuantity>(`[${error.code}]:${error.message}`)
            : Result.fail<FoodQuantity>(`Erreur inattendue. ${FoodQuantity.constructor.name}`);
      }
   }
}
