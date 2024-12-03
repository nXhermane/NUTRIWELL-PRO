import { AggregateID, INutritionalSource } from "@/core/shared";
import { NutritionalRefPersistence } from "../repositories/types";

export interface NutritionalReferenceValueDto {
   tagnames: string;
   source: INutritionalSource;
   unit: string;
   values: NutritionalRefPersistence[];
   id: AggregateID;
   createdAt: string;
   updatedAt: string;
}
