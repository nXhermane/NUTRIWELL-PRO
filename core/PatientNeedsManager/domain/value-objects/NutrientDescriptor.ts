import { ExceptionBase, NutrientTagname, NutrientUnit, Result, ValueObject } from "@/core/shared";
import { VariableMappingTable } from "../entities/types";
import { Expression } from "./Expression";
import { CreateNutrientDescriptorProps } from "./types";

export interface INutrientDescriptor {
   expression: Expression;
   tagname: NutrientTagname;
   unit: NutrientUnit;
   variables: VariableMappingTable;
}

export class NutrientDescriptor extends ValueObject<INutrientDescriptor> {
   getVariableTable(): VariableMappingTable {
      return this.props.variables;
   }
   get expression(): string {
      return this.props.expression.toString();
   }
   get tagname(): string {
      return this.props.tagname.toString();
   }
   get unit(): string {
      return this.props.unit.toString();
   }
   toObject(): CreateNutrientDescriptorProps {
      return {
         expression: this.expression,
         tagname: this.tagname,
         unit: this.unit,
         variables: this.getVariableTable(),
      };
   }
   protected validate(props: INutrientDescriptor): void {}
   static create(createNutrientDescriptorProps: CreateNutrientDescriptorProps): Result<NutrientDescriptor> {
      try {
         const expression = Expression.create(createNutrientDescriptorProps.expression);
         const tagname = NutrientTagname.create(createNutrientDescriptorProps.tagname);
         const unit = NutrientUnit.create(createNutrientDescriptorProps.unit);
         const combinedResult = Result.combine([expression, unit, tagname]);
         if (combinedResult.isFailure) return Result.fail<NutrientDescriptor>(String(combinedResult.err));

         const descriptor = new NutrientDescriptor({
            expression: expression.val,
            tagname: tagname.val,
            unit: unit.val,
            variables: createNutrientDescriptorProps.variables,
         });
         return Result.ok<NutrientDescriptor>(descriptor);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<NutrientDescriptor>(`[${error.code}]:${error.message}`)
            : Result.fail<NutrientDescriptor>(`Erreur inattendue. ${NutrientDescriptor?.constructor.name}`);
      }
   }
}
