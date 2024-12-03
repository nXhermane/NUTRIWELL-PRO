import { AggregateID, INutritionalSource } from "@/core/shared";
import { FormularVariables } from "../../domain/entities/NutritionFormular";
import { IFormularExpression } from "../../domain/value-objects/FormularExpression";

export type FormularExpressionPersistence = IFormularExpression
export interface Timestamp {
   createdAt: string;
   updatedAt: string;
}

export interface NutritionalReferenceValuePersistence extends Timestamp {
   id: AggregateID;
   tagnames: string;
   source: INutritionalSource;
   unit: string;
   values: NutritionalRefPersistence[];
   conditionVariables: VariablesPersistence;
}
export interface NutritionFormularPersistence extends Timestamp {
   id: AggregateID;
   name: string;
   source: INutritionalSource
   conditionVariables: VariablesPersistence
   formularExpressions: FormularExpressionPersistence[]
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
