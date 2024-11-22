import { AggregateID, EntityUniqueID, ExceptionBase, Result, ValueObject } from "@shared";

export interface IMealsType {
   typeId: AggregateID;
   name: string;
   nameF: string;
}
export class MealsType extends ValueObject<IMealsType> {
   constructor(props: IMealsType) {
      super(props);
      this.validate(props);
   }
   validate(props: IMealsType): void {}
   static create(props: Omit<IMealsType, "typeId">): Result<MealsType> {
      try {
         const typeId = new EntityUniqueID().toValue();
         const type = new MealsType({
            typeId,
            ...props,
         });
         return Result.ok<MealsType>(type);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<MealsType>(`[${error.code}]:${error.message}`)
            : Result.fail<MealsType>(`Erreur inattendue. ${MealsType.constructor.name}`);
      }
   }
}
