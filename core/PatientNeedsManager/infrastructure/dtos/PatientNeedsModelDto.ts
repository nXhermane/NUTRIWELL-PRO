import { AggregateID } from "@/core/shared";
import { Energy, Macronutrients, Micronutrients } from "../../domain/entities/PatientNeedsModel";

export interface PatientNeedsModelDto {
    id: AggregateID
    energy: Energy;
    macronutrients: Macronutrients;
    micronutrients: Micronutrients;
    createdAt: string;
    updatedAt: string
}