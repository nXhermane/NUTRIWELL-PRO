import { AggregateID } from "@/core/shared";
import { NutritionalRefPersistence } from "../repositories/types";

export interface NutritionalReferenceValueDto {
   tagnames: string;
   origin: string;
   unit: string;
   values: NutritionalRefPersistence[];
   id: AggregateID;
   createdAt: string;
   updatedAt: string;
}
