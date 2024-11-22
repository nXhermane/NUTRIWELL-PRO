import { CreateEntityProps, EmptyStringError, Entity, ExceptionBase, Guard, Result } from "@/core/shared";
import { VariableMappingTable } from "./types";
import { VariableObject } from "./NutritionalReferenceValue";
import SmartCal from "smartcal";

export type FormularVariables = VariableMappingTable;
export type NutritionFormularResult = {
   value: number | string;
   name: string;
};
export interface INutritionFormular {
   name: string;
   expression: string;
   condition: string;
   variables: FormularVariables;
}
export class NutritionFormular extends Entity<INutritionFormular> {
   constructor(createNutritionFormular: CreateEntityProps<INutritionFormular>) {
      super(createNutritionFormular);
   }

   get name(): string {
      return this.props.name;
   }
   set name(value: string) {
      this.props.name = value;
      this.validate();
   }
   get expression(): string {
      return this.props.expression;
   }
   set expression(value: string) {
      this.props.expression = value;
      this.validate();
   }
   get condition(): string {
      return this.props.condition;
   }
   set condition(value: string) {
      this.props.condition = value;
      this.validate();
   }

   get variables(): FormularVariables {
      return this.props.variables;
   }

   set variables(value: FormularVariables) {
      this.props.variables = value;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom de la formule ne doit pas etre vide.");
      if (Guard.isEmpty(this.props.expression).succeeded) throw new EmptyStringError("L'expression de la formule ne doit pas etre vide");
      if (Guard.isEmpty(this.props.condition).succeeded) this.props.condition = "1";
      this._isValid = true;
   }
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
}
