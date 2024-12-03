import { EmptyStringError, Entity, Guard, INutritionalSource, NutritionalSource } from "@/core/shared";
import { INutritionalRef, NutritionalRef } from "../value-objects/NutritionalRef";
import { VariableMappingTable } from "./types";

export type VariableObject = { [variableName: string]: any };
export type NutritionalRecommendedValue = {
   value: number;
   unit: string;
   tagname: string;
   source: INutritionalSource
};
export type ConditionVariables = VariableMappingTable;
export interface INutritionalReferenceValue {
   tagnames: string;
   source: NutritionalSource;
   unit: string;
   values: NutritionalRef[];
   variables: ConditionVariables;
}
export class NutritionalReferenceValue extends Entity<INutritionalReferenceValue> {
   get tagnames(): string {
      return this.props.tagnames;
   }
   set tagnames(value: string) {
      this.props.tagnames = value;
      this.validate();
   }
   get source(): INutritionalSource {
      return this.props.source.unpack();
   }
   set source(value: NutritionalSource) {
      this.props.source = value;
      this.validate();
   }
   get unit(): string {
      return this.props.unit;
   }
   set unit(value: string) {
      this.props.unit = value;
      this.validate();
   }
   get values(): INutritionalRef[] {
      return this.props.values.map((value: NutritionalRef) => value.unpack());
   }
   get variables(): ConditionVariables {
      return this.props.variables;
   }
   set variables(value: ConditionVariables) {
      this.props.variables = value;
      this.validate();
   }

   addValue(...values: NutritionalRef[]): void {
      values.forEach((value: NutritionalRef) => {
         const index = this.props.values.findIndex((val) => value.equals(val));
         if (index !== -1) this.props.values[index] = value;
         else this.props.values.push(value);
      });
      this.validate();
   }
   removeValue(value: NutritionalRef): void {
      const index = this.props.values.findIndex((val) => val.equals(value));
      if (index !== -1) this.props.values.splice(index, 1);
      this.validate();
   }

   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.tagnames).succeeded) throw new EmptyStringError("Le Tagnane ne doit pas etre vide.");
      if (Guard.isEmpty(this.props.unit).succeeded) throw new EmptyStringError("L'unité ne doit pas etre vide");
      if (Guard.isEmpty(this.props.values).succeeded) throw new EmptyStringError("L'values pas etre vide");
      this._isValid = true;
   }
}
