import { ArgumentInvalidException, ExceptionBase, Guard, NutrientTagname, Result, ValueObject } from "@/core/shared";
import { VariableMappingTable } from "../entities/types";
import { Expression } from "./Expression";
import { CreateValidationRegularProps } from "../types";

export interface IPatientNeedsValidationRegular {
   expression: Expression;
   nutrientsInsolved: NutrientTagname[];
   otherVariables: VariableMappingTable;
}

export class PatientNeedsValidationRegular extends ValueObject<IPatientNeedsValidationRegular> {
   getVariables(): VariableMappingTable {
      return this.props.otherVariables;
   }
   getExpression(): string {
      return this.props.expression.toString();
   }
   getNutrientInsolved(): string[] {
      return this.props.nutrientsInsolved.map((nutrientName) => nutrientName.toString());
   }
   validateNutrientsExist(nutrientList: NutrientTagname[]): boolean {
      const nutrientSet = new Set(nutrientList.map((nut) => nut.toString())); // Convertit la liste des nutriments en un Set pour un accès rapide
      return this.props.nutrientsInsolved.every((nutrient) => nutrientSet.has(nutrient.toString()));
   }
   protected validate(props: IPatientNeedsValidationRegular): void {
      if (Guard.isEmpty(this.props.nutrientsInsolved).succeeded)
         throw new ArgumentInvalidException("Il doit y avoir un nutriment impliqué dans l'expression de validation d'un model de besoin.");
   }
   static create(props: CreateValidationRegularProps): Result<PatientNeedsValidationRegular> {
      try {
         const expression = Expression.create(props.expression);
         const nutrientInsolved = props.nutrientInsolved.map((tagname) => NutrientTagname.create(tagname));
         const composedResult = Result.combine([expression, ...nutrientInsolved]);
         const validationRegular = new PatientNeedsValidationRegular({
            expression: expression.val,
            nutrientsInsolved: nutrientInsolved.map((nutrient) => nutrient.val),
            otherVariables: props.otherVariables,
         });
         return Result.ok(validationRegular);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<PatientNeedsValidationRegular>(`[${e.code}]: ${e.message}`)
            : Result.fail<PatientNeedsValidationRegular>(`Erreur inattendue. ${PatientNeedsValidationRegular?.constructor.name}`);
      }
   }
}
