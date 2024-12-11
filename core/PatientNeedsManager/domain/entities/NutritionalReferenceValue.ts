import {
   EmptyStringError,
   Entity,
   ExceptionBase,
   Guard,
   INutritionalSource,
   NutrientTagname,
   NutrientUnit,
   NutritionalSource,
   Result,
} from "@/core/shared";
import { INutritionalRef, NutritionalRef } from "../value-objects/NutritionalRef";
import { CreateNutritionalReferenceValueProps, VariableMappingTable } from "./types";
import { NutritionalVariable } from "../value-objects/NutritionalVariable";

export type VariableObject = { [variableName: string]: any };
export type NutritionalRecommendedValue = {
   value: number;
   unit: string;
   tagname: string;
   source: INutritionalSource;
};
export type ConditionVariables = VariableMappingTable;
export interface INutritionalReferenceValue {
   tagname: NutrientTagname;
   source: NutritionalSource;
   unit: NutrientUnit;
   values: NutritionalRef[];
   variables: ConditionVariables;
   systemVariableName: string;
}
export class NutritionalReferenceValue extends Entity<INutritionalReferenceValue> {
   get tagname(): string {
      return this.props.tagname.toString();
   }
   set tagname(value: NutrientTagname) {
      this.props.tagname = value;
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
      return this.props.unit.toString();
   }
   set unit(value: NutrientUnit) {
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
   get systemVariableName(): string {
      return this.props.systemVariableName;
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
      if (Guard.isEmpty(this.props.values).succeeded)
         throw new EmptyStringError("On doit avoir au moin un anref par NutritionalReferenceValue pas etre vide");
      this._isValid = true;
   }
   static create(createNutritionalRefValue: CreateNutritionalReferenceValueProps): Result<NutritionalReferenceValue> {
      try {
         const tagname = NutrientTagname.create(createNutritionalRefValue.tagnames);
         const source = NutritionalSource.create(createNutritionalRefValue.source);
         const unit = NutrientUnit.create(createNutritionalRefValue.unit);
         const combinedResults = Result.combine([tagname, source, unit]);
         if (combinedResults.isFailure) return Result.fail<NutritionalReferenceValue>(String(combinedResults.err));
         const variableName = NutritionalVariable.create({
            formularOrNutrientName: tagname.val,
            source: source.val,
         });
         const nutritionalRefValues = createNutritionalRefValue.values.map((value) => NutritionalRef.create(value));
         const combinedResults2 = Result.combine([variableName, ...nutritionalRefValues]);
         if (combinedResults2.isFailure) return Result.fail<NutritionalReferenceValue>(String(combinedResults2.err));
         const nutritionalReferenceValue = new NutritionalReferenceValue({
            props: {
               tagname: tagname.val,
               source: source.val,
               unit: unit.val,
               values: nutritionalRefValues.map((value) => value.val),
               variables: createNutritionalRefValue.variables,
               systemVariableName: variableName.val.getVariableName(),
            },
         });
         return Result.ok<NutritionalReferenceValue>(nutritionalReferenceValue);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutritionalReferenceValue>(`[${error.code}]:${error.message}`)
            : Result.fail<NutritionalReferenceValue>(`Erreur inattendue. ${NutritionalReferenceValue?.constructor.name}`);
      }
   }
}
