import { EmptyStringError, ExceptionBase, Guard, Result, ValueObject } from "@/core/shared";
import { VariableMappingTable } from "../entities/types";
import { Expression } from "./Expression";
import { CreateFormularExpression } from "./types";
// Ici c'est supposé que chaque formule nutritionnelle a une condititon a valider avant d'appliquer la formule a un patient
export interface IFormularExpression {
   condition: Expression; // condititon 
   expression: Expression; // expression mathematique a évalué 
   expressionVariables: VariableMappingTable;
}

export class FormularExpression extends ValueObject<IFormularExpression> {
   protected validate(props: IFormularExpression): void {
   }
   get expression(): string { return this.props.expression.toString(); }
   get condition(): string { return this.props.condition.toString(); }
   get expressionVariables(): VariableMappingTable { return this.props.expressionVariables; }
   static create(props: CreateFormularExpression): Result<FormularExpression> {
      try {
         const condition = Expression.create(props.condition)
         const expression = Expression.create(props.expression);
         const combinedResult = Result.combine([condition, expression])
         if (combinedResult.isFailure) return Result.fail<FormularExpression>(String(combinedResult.err))
         const formular = new FormularExpression({
            condition: condition.val,
            expression: expression.val,
            expressionVariables: props.expressionVariables,
         });
         return Result.ok(formular);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<FormularExpression>(`[${error.code}]:${error.message}`)
            : Result.fail<FormularExpression>(`Erreur inattendue. ${FormularExpression?.constructor.name}`);
      }
   }
}
