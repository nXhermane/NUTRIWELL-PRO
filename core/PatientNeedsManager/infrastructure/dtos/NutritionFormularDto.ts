import { AggregateID } from "@/core/shared";
import { FormularVariables } from "../../domain/entities/NutritionFormular";

export interface NutritionFormularDto {
   id: AggregateID;
   name: string;
   expression: string;
   condition: string;
   variables: FormularVariables;
   createdAt: string;
   updatedAt: string;
}
