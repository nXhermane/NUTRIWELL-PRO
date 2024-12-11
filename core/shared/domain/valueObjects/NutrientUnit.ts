import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase } from "../../exceptions";
import { DomainPrimitive, ValueObject } from "../ValueObject";

export class NutrientUnit extends ValueObject<string> {
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("L'unite d'un nutriment ne peut être une valeur vide.");
      //TODO : Après je dois implementer la verification des unités qui n'est pas encore intéfrés maintenant
   }
   toString(): string {
      return this.props.value;
   }
   static create(value: string): Result<NutrientUnit> {
      try {
         const unit = new NutrientUnit({ value });
         return Result.ok<NutrientUnit>(unit);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutrientUnit>(`[${error.code}]:${error.message}`)
            : Result.fail<NutrientUnit>(`Erreur inattendue. ${NutrientUnit?.constructor.name}`);
      }
   }
}
