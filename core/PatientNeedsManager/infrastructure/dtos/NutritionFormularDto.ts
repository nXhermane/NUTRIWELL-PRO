import { AggregateID } from "@/core/shared";
import { VariableMappingTable } from "../../domain/entities/types";
import { CreateFormularExpression } from "../../domain/value-objects/types";
import { NutritionalSourcePersistenceType } from "../database/patientNeeds";

export interface NutritionFormularDto {
   id: AggregateID;
   name: string;
   source: NutritionalSourcePersistenceType;
   conditionVariables: VariableMappingTable;
   formularExpressions: CreateFormularExpression[];
   unit: string
   systemVariableName: string
   createdAt: string;
   updatedAt: string;
}
