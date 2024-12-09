import { AggregateID } from "@/core/shared";
import { NutritionalRefPersistence } from "../repositories/types";
import { NutritionalSourcePersistenceType } from "../database/patientNeeds";

export interface NutritionalReferenceValueDto {
   tagname: string;
   source: NutritionalSourcePersistenceType;
   unit: string;
   values: NutritionalRefPersistence[];
   systemVariableName:string;
   id: AggregateID;
   createdAt: string;
   updatedAt: string;
}
