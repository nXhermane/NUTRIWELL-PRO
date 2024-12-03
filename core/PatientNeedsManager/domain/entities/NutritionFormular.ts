import { CreateEntityProps, EmptyStringError, Entity, ExceptionBase, Guard, INutritionalSource, NutritionalSource, Result } from "@/core/shared";
import { VariableMappingTable } from "./types";
import { FormularExpression, IFormularExpression } from "../value-objects/FormularExpression";

export type FormularVariables = VariableMappingTable;
export type NutritionFormularResult = {
   value: number | string;
   name: string;
};
// On a besoin que les formules aussi respecte la convention avec les valeurs de references . 
// Donc on a un nom de formules et on a des conditions pour pouvoir choisir la version de la formule a utiliser deplus que ceux sont des entités 

export interface INutritionFormular {
   name: string;
   source: NutritionalSource
   conditionVariables: VariableMappingTable
   formularExpressions: FormularExpression[]
}

export class NutritionFormular extends Entity<INutritionFormular> {
   static create(props: INutritionFormular): Result<NutritionFormular> {
      try {
         const nutritionFormular = new NutritionFormular({ props });
         return Result.ok<NutritionFormular>(nutritionFormular);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutritionFormular>(`[${error.code}]:${error.message}`)
            : Result.fail<NutritionFormular>(`Erreur inattendue. ${NutritionFormular?.constructor.name}`);
      }
   }

   get name(): string {
      return this.props.name;
   }

   get source(): INutritionalSource {
      return this.props.source.unpack()
   }

   get conditionVariables(): VariableMappingTable {
      return this.props.conditionVariables;
   }

   get formularExpressions(): IFormularExpression[] {
      return this.props.formularExpressions.map(expression => expression.unpack());
   }

   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom de la formule ne doit pas etre vide.");
      this._isValid = true;
   }

   set name(value: string) {
      this.props.name = value;
      this.validate();
   }

   set source(value: NutritionalSource) {
      this.props.source = value
      this.validate()
   }

   set conditionVariables(value: VariableMappingTable) {
      this.props.conditionVariables = value;
      this.validate()
   }
   addFormularExpression(...formularExpressions: FormularExpression[]): void {
      formularExpressions.forEach(expression => {
         const index = this.props.formularExpressions.findIndex(exp => exp.equals(expression));
         if (index !== -1) this.props.formularExpressions[index] = expression;
         else this.props.formularExpressions.push(expression);
      })
   }
   removeFormularExpression(...formularExpressions: FormularExpression[]): void {
      formularExpressions.forEach(expression => {
         const index = this.props.formularExpressions.findIndex(exp => exp.equals(expression));
         if (index !== -1) this.props.formularExpressions.splice(index, 1);
      })
   }
}
