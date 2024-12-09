import { DomainPrimitive, EmptyStringError, EvaluateMathExpression, ExceptionBase, Guard, InvalidArgumentFormatError, Result, ValueObject } from "@/core/shared";

export class Expression extends ValueObject<string> {
   toString(): string {
      return this.props.value;
   }
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value).succeeded) throw new EmptyStringError("La valeur d'une expression ne peut être vide.");
      if (!EvaluateMathExpression.isValidExpression(props.value)) throw new InvalidArgumentFormatError("L'expression n'est pas valide.")
   }
   static create(expression: string): Result<Expression> {
      try {
         const exp = new Expression({ value: expression });
         return Result.ok<Expression>(exp);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Expression>(`[${error.code}]:${error.message}`)
            : Result.fail<Expression>(`Erreur inattendue. ${Expression?.constructor.name}`);
      }
   }
}
