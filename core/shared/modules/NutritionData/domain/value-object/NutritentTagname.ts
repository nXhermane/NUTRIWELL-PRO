import { Guard, Result } from "./../../../../core";
import { DomainPrimitive, ValueObject } from "./../../../../domain";
import { EmptyStringError, ExceptionBase } from "./../../../../exceptions";
export class NutrientTagname extends ValueObject<string> {
   toString(): string {
      return this.props.value;
   }
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("Le tagname Infoods du nutriment ne peut être vide.");
   }
   static create(tagname: string): Result<NutrientTagname> {
      try {
         const nutrientTagname = new NutrientTagname({ value: tagname });
         return Result.ok<NutrientTagname>(nutrientTagname);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutrientTagname>(`[${error.code}]:${error.message}`)
            : Result.fail<NutrientTagname>(`Erreur inattendue. ${NutrientTagname?.constructor.name}`);
      }
   }
}
