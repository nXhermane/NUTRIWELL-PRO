import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase } from "../../exceptions";
import { ValueObject, DomainPrimitive } from "../ValueObject";

export class FormularName extends ValueObject<string> {
   toString(): string {
      return this.props.value;
   }
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("Le nom de la formule ne peut pas être vide.");
   }
   static create(formularName: string): Result<FormularName> {
      try {
         const nutrientTagname = new FormularName({ value: formularName });
         return Result.ok<FormularName>(nutrientTagname);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<FormularName>(`[${error.code}]:${error.message}`)
            : Result.fail<FormularName>(`Erreur inattendue. ${FormularName?.constructor.name}`);
      }
   }
}
