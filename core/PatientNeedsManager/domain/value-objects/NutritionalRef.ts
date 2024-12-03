import { ArgumentNotProvidedException, EmptyStringError, ExceptionBase, Guard, NegativeValueError, Result, ValueObject } from "@/core/shared";

export interface INutritionalRef {
   condition: string;
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
      if (Guard.isEmpty(props.condition).succeeded) throw new EmptyStringError("La conditon de NutritionalRef ne peut être vide. Elle doit être mise a vrai au moins.")
      if (Guard.isNegative(props.weight).succeeded) throw new NegativeValueError("La valeur du poids d'application du NutritionalRef ne doit être négative.")
      if (Guard.isEmpty(props.amt).succeeded && Guard.isEmpty(props.anr).succeeded && Guard.isEmpty(props.as).succeeded && Guard.isEmpty(props.bme).succeeded) throw new ArgumentNotProvidedException("Au moins un des valeurs de références doivent être fourni.")
   }
   static create(props: INutritionalRef): Result<NutritionalRef> {
      try {
         const ref = new NutritionalRef(props);
         return Result.ok<NutritionalRef>(ref);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutritionalRef>(`[${error.code}]:${error.message}`)
            : Result.fail<NutritionalRef>(`Erreur inattendue. ${NutritionalRef?.constructor.name}`);
      }
   }
}
