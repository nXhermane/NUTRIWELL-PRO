import { AggregateID, EntityUniqueID, ExceptionBase, Result, ValueObject } from "@shared";

export interface IMealsCategory {
   categoryId: AggregateID;
   name: string;
   nameF: string;
}
export class MealsCategory extends ValueObject<IMealsCategory> {
   constructor(props: IMealsCategory) {
      super(props);
      this.validate(props);
   }

   validate(props: IMealsCategory): void {}
   static create(props: Omit<IMealsCategory, "categoryId">): Result<MealsCategory> {
      try {
         const categoryId = new EntityUniqueID().toValue();
         const mealscategory = new MealsCategory({
            categoryId,
            ...props,
         });
         return Result.ok<MealsCategory>(mealscategory);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<MealsCategory>(`[${error.code}]:${error.message}`)
            : Result.fail<MealsCategory>(`Erreur inattendue. ${MealsCategory.constructor.name}`);
      }
   }
}
