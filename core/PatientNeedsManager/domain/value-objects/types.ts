import { VariableMappingTable } from "../entities/types";

export type CreateNutritionalRef = {
   condition: string;
   weight: number;
   bme?: number;
   anr?: number;
   amt?: number;
   as?: number;
};
export type CreateFormularExpression = {
   condition: string;
   expression: string;
   expressionVariables: VariableMappingTable;
};

export type CreateNutrientDescriptorProps = {
   expression: string;
   tagname: string;
   unit: string;
   variables: VariableMappingTable;
};

export type CreateHealthMetricProps = {
   code: string;
   unit: string;
   value: number;
};
