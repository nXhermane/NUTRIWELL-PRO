import { AggregateID, INutritionalSource } from "@/core/shared";
import { CreateFormularExpression } from "../../domain/value-objects/types";

export type FormularExpressionPersistence = CreateFormularExpression;
export interface Timestamp {
   createdAt: string;
   updatedAt: string;
}

export interface NutritionalReferenceValuePersistence extends Timestamp {
   id: AggregateID;
   tagname: string;
   source: INutritionalSource;
   unit: string;
   values: NutritionalRefPersistence[];
   conditionVariables: VariablesPersistence;
   systemVariableName: string
}
export interface NutritionFormularPersistence extends Timestamp {
   id: AggregateID;
   name: string;
   source: INutritionalSource;
   conditionVariables: VariablesPersistence;
   formularExpressions: FormularExpressionPersistence[];
   unit: string
   systemVariableName: string
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
export interface PatientDataVariablePersistence extends Timestamp {
   id: string;
   patientProfilId: string;
   variables: Record<string, string>;
}

export interface PatientProfilPersistence extends Timestamp {
   id: string;
}
