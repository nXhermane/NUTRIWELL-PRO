import { EmptyStringError, EvaluateMathExpression, ExceptionBase, Guard, InvalidArgumentFormatError, Result, ValueObject } from "@/core/shared";
import { VariableMappingTable } from "../entities/types";

export interface INutrientDescriptor {
   expression: string;
   tagname: string;
   unit: string;
   variables: VariableMappingTable;
}

export class NutrientDescriptor extends ValueObject<INutrientDescriptor> {
   getVariableTable(): VariableMappingTable {
      return this.props.variables;
   }
   get expression(): string {
      return this.props.expression;
   }
   get tagname(): string {
      return this.props.tagname;
   }
   get unit(): string {
      return this.props.unit;
   }
   protected validate(props: INutrientDescriptor): void {
      if (Guard.isEmpty(props.tagname).succeeded) throw new EmptyStringError("Le tagname du nutriment ne peut être vide.");
      if (Guard.isEmpty(props.expression).succeeded)
         throw new EmptyStringError("La valeur de l'expression a evaluer pour calculer le besoin nutritionnel ne peut être vide.");
      if (Guard.isEmpty(props.unit).succeeded) throw new EmptyStringError("L'unite du nutriment ne peut être vide .");
      if (EvaluateMathExpression.isValidExpression(props.expression))
         throw new InvalidArgumentFormatError("L'expression à évaluer n'est pas correcte. Veillez modifier l'expression.");
   }
   static create(props: INutrientDescriptor): Result<NutrientDescriptor> {
      try {
         const descriptor = new NutrientDescriptor(props);
         return Result.ok<NutrientDescriptor>(descriptor);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutrientDescriptor>(`[${error.code}]:${error.message}`)
            : Result.fail<NutrientDescriptor>(`Erreur inattendue. ${NutrientDescriptor?.constructor.name}`);
      }
   }
}
