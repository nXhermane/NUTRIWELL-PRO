import { ValueObject } from "./../ValueObject";
import { NegativeValueError, ExceptionBase } from "./../../exceptions";
import { Result } from "./../../core";
export interface IQuantity {
   value: number;
   unit: string;
}
export class Quantity extends ValueObject<IQuantity> {
   constructor(props: IQuantity) {
      super(props);
      this.validate(props);
   }

   validate(props: IQuantity): void {
      if (props.value <= 0) {
         throw new NegativeValueError("La quantité ne peut pas être négative. Veuillez entrer une valeur supérieure à zéro.");
      }
   }
   static create(props: IQuantity): Result<Quantity> {
      try {
         const quantity = new Quantity(props);
         return Result.ok<Quantity>(quantity);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Quantity>(`[${e.code}]:${e.message}`)
            : Result.fail<Quantity>(`Unexpected Error. ${Quantity?.constructor.name}`);
      }
   }
}
