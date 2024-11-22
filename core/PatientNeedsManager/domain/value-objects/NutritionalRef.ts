import { ExceptionBase, Result, ValueObject } from "@/core/shared";

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
      throw new Error("Method not implemented.");
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
