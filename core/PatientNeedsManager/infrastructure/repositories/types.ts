import { AggregateID } from "@/core/shared";
import { FormularVariables } from "../../domain/entities/NutritionFormular";

export interface Timestamp {
   createdAt: string;
   updatedAt: string;
}

export interface NutritionalReferenceValuePersistence extends Timestamp {
   id: AggregateID;
   tagnames: string;
   origin: string;
   unit: string;
   values: NutritionalRefPersistence[];
   conditionVariables: VariablesPersistence;
}
export interface NutritionFormularPersistence extends Timestamp {
   id: AggregateID;
   name: string;
   expression: string;
   condition: string;
   variables: FormularVariables;
}
export interface NutritionalRefPersistence {
   condition: string;
   weight: number;
   bme?: number;
   anr?: number;
   amt?: number;
   as?: number;
}

type VariablesPersistence = { [key: string]: string };
