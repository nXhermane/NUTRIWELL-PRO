import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase } from "../../exceptions";
import { DomainPrimitive, ValueObject } from "../ValueObject";

export class FormularUnit extends ValueObject<string> {
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("L'unite d'une formule ne peut être vide.");
      //TODO : Après je dois implementer la verification des unités qui n'est pas encore intéfrés maintenant
   }
   toString(): string {
      return this.props.value;
   }
   static create(value: string): Result<FormularUnit> {
      try {
         const unit = new FormularUnit({ value });
         return Result.ok<FormularUnit>(unit);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<FormularUnit>(`[${error.code}]:${error.message}`)
            : Result.fail<FormularUnit>(`Erreur inattendue. ${FormularUnit?.constructor.name}`);
      }
   }
}
