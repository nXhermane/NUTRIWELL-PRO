import {
   CreateEntityProps,
   EmptyStringError,
   Entity,
   ExceptionBase,
   FormularName,
   FormularUnit,
   Guard,
   INutritionalSource,
   NutritionalSource,
   Result,
} from "@/core/shared";
import { CreateNutritionFormulaProps, VariableMappingTable } from "./types";
import { FormularExpression, IFormularExpression } from "../value-objects/FormularExpression";
import { NutritionalVariable } from "../value-objects/NutritionalVariable";

export type FormularVariables = VariableMappingTable;
export type NutritionFormularResult = {
   value: number | string;
   name: string;
};
// On a besoin que les formules aussi respectent la convention des valeurs de references .
// Donc on a un nom de formules et on a des conditions pour pouvoir choisir la version de la formule a utiliser deplus que ceux sont des entités

export interface INutritionFormular {
   name: FormularName;
   source: NutritionalSource;
   conditionVariables: VariableMappingTable;
   formularExpressions: FormularExpression[];
   systemVariableName: string;
   unit: FormularUnit; // Ici c'est supposé que toute formule a une unité pour sa valeur de retour
}

export class NutritionFormular extends Entity<INutritionFormular> {
   static create(props: CreateNutritionFormulaProps): Result<NutritionFormular> {
      try {
         const name = FormularName.create(props.name);
         const source = NutritionalSource.create(props.source);
         const combinedResult = Result.combine([name, source]);
         if (combinedResult.isFailure) return Result.fail<NutritionFormular>(String(combinedResult.err));
         const systemVariableName = NutritionalVariable.create({
            formularOrNutrientName: name.val,
            source: source.val,
         });
         const unit = FormularUnit.create(props.unit);
         const formularExpressions = props.formularExpressions.map((formularExpression) => FormularExpression.create(formularExpression));
         const combinedResult2 = Result.combine([systemVariableName, unit, ...formularExpressions]);
         if (combinedResult2.isFailure) return Result.fail<NutritionFormular>(String(combinedResult2.err));
         const nutritionFormular = new NutritionFormular({
            props: {
               name: name.val,
               source: source.val,
               conditionVariables: props.conditionVariables,
               formularExpressions: formularExpressions.map((expression) => expression.val),
               systemVariableName: systemVariableName.val.getVariableName(),
               unit: unit.val,
            },
         });
         return Result.ok<NutritionFormular>(nutritionFormular);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutritionFormular>(`[${error.code}]:${error.message}`)
            : Result.fail<NutritionFormular>(`Erreur inattendue. ${NutritionFormular?.constructor.name}`);
      }
   }

   get name(): string {
      return this.props.name.toString();
   }

   get source(): INutritionalSource {
      return this.props.source.unpack();
   }

   get conditionVariables(): VariableMappingTable {
      return this.props.conditionVariables;
   }

   get formularExpressions(): IFormularExpression[] {
      return this.props.formularExpressions.map((expression) => expression.unpack());
   }
   get systemVariableName(): string {
      return this.props.systemVariableName;
   }
   get unit(): string {
      return this.props.unit.toString();
   }

   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.systemVariableName).succeeded) throw new EmptyStringError("Le systemVariableName ne peux être vide.");
      this._isValid = true;
   }

   set name(value: FormularName) {
      this.props.name = value;
      this.validate();
   }

   set source(value: NutritionalSource) {
      this.props.source = value;
      this.validate();
   }

   set conditionVariables(value: VariableMappingTable) {
      this.props.conditionVariables = value;
      this.validate();
   }

   set unit(value: FormularUnit) {
      this.props.unit = value;
      this.validate();
   }
   addFormularExpression(...formularExpressions: FormularExpression[]): void {
      formularExpressions.forEach((expression) => {
         const index = this.props.formularExpressions.findIndex((exp) => exp.equals(expression));
         if (index !== -1) this.props.formularExpressions[index] = expression;
         else this.props.formularExpressions.push(expression);
      });
   }
   removeFormularExpression(...formularExpressions: FormularExpression[]): void {
      formularExpressions.forEach((expression) => {
         const index = this.props.formularExpressions.findIndex((exp) => exp.equals(expression));
         if (index !== -1) this.props.formularExpressions.splice(index, 1);
      });
   }
}
