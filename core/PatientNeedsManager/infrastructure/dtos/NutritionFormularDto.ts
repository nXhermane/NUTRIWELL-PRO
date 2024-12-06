import { AggregateID, INutritionalSource } from "@/core/shared";
import { FormularVariables } from "../../domain/entities/NutritionFormular";
import { INutrientAmount } from "@/core/FoodsAndRecipesDatabase/domain";
import { VariableMappingTable } from "../../domain/entities/types";
import { IFormularExpression } from "../../domain/value-objects/FormularExpression";

export interface NutritionFormularDto {
   id: AggregateID;
   name: string;
   source: INutritionalSource;
   conditionVariables: VariableMappingTable;
   formularExpressions: IFormularExpression[];
   createdAt: string;
   updatedAt: string;
}
