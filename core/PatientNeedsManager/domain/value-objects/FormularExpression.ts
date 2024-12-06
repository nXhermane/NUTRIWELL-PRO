import { EmptyStringError, ExceptionBase, Guard, Result, ValueObject } from "@/core/shared";
import { VariableMappingTable } from "../entities/types";

export interface IFormularExpression {
   condition: string;
   expression: string;
   expressionVariables: VariableMappingTable;
}

export class FormularExpression extends ValueObject<IFormularExpression> {
   protected validate(props: IFormularExpression): void {
      if (Guard.isEmpty(props.expression).succeeded) throw new EmptyStringError("La valeur de l'expression d'une formule ne peux être vide.");
      if (Guard.isEmpty(props.condition).succeeded)
         throw new EmptyStringError("La valeur de la condition a remplir pour utiliser une formule ne peux être vide.");
   }
   static create(props: IFormularExpression): Result<FormularExpression> {
      try {
         const formular = new FormularExpression(props);
         return Result.ok(formular);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<FormularExpression>(`[${error.code}]:${error.message}`)
            : Result.fail<FormularExpression>(`Erreur inattendue. ${FormularExpression?.constructor.name}`);
      }
   }
}
