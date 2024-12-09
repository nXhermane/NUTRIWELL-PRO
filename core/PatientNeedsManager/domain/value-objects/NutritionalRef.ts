import { ArgumentNotProvidedException, EmptyStringError, EvaluateMathExpression, ExceptionBase, Guard, InvalidArgumentFormatError, NegativeValueError, Result, ValueObject } from "@/core/shared";
import { Expression } from "./Expression";
import { CreateNutritionalRef } from "./types";

export interface INutritionalRef {
   condition: Expression;
   weight: number;
   bme?: number;
   anr?: number;
   amt?: number;
   as?: number;
}

export class NutritionalRef extends ValueObject<INutritionalRef> {
   constructor(props: INutritionalRef) {
      super(props);
   }
   protected validate(props: INutritionalRef): void {
      if (Guard.isNegative(props.weight).succeeded)
         throw new NegativeValueError("La valeur du poids d'application du NutritionalRef ne doit être négative.");
      if (
         Guard.isEmpty(props.amt).succeeded &&
         Guard.isEmpty(props.anr).succeeded &&
         Guard.isEmpty(props.as).succeeded &&
         Guard.isEmpty(props.bme).succeeded
      )
         throw new ArgumentNotProvidedException("Au moins un des valeurs de références doivent être fourni.");
   }
   static create(props: CreateNutritionalRef): Result<NutritionalRef> {
      try {
         const condition = Expression.create(props.condition)
         if (condition.isFailure) return Result.fail<NutritionalRef>(String(condition.err))
         const ref = new NutritionalRef({
            condition: condition.val,
            weight: props.weight,
            bme: props.bme,
            anr: props.anr,
            amt: props.amt,
            as: props.as,
         });
         return Result.ok<NutritionalRef>(ref);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutritionalRef>(`[${error.code}]:${error.message}`)
            : Result.fail<NutritionalRef>(`Erreur inattendue. ${NutritionalRef?.constructor.name}`);
      }
   }
}
