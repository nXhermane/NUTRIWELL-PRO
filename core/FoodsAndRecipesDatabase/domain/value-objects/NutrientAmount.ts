import { AggregateID, EmptyStringError, ExceptionBase, Guard, NegativeValueError, Result, ValueObject } from "@shared";

export interface INutrientAmount {
   nutrientId: AggregateID;
   value: number;
   originalValue?: string;
}

export class NutrientAmount extends ValueObject<INutrientAmount> {
   [x: string]: any;
   protected validate(props: INutrientAmount): void {
      if (!Guard.isEmpty(props.nutrientId).succeeded) throw new EmptyStringError("The nutrientId cant not be empty or null");
      if (Guard.isNegative(props.value).succeeded) throw new NegativeValueError("The nutrient Value can't be negative");
   }
   static create(props: INutrientAmount): Result<NutrientAmount> {
      try {
         const nutrientAmount = new NutrientAmount(props);
         return Result.ok<NutrientAmount>(nutrientAmount);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutrientAmount>(`[${error.code}]:${error.message}`)
            : Result.fail<NutrientAmount>(`Erreur inattendue. ${NutrientAmount.constructor.name}`);
      }
   }
}
