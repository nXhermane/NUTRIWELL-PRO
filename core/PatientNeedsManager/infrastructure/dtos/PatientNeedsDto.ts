import { AggregateID, NutrientNeedsValue } from "@/core/shared";

export interface PatientNeedsDto {
    id: AggregateID;
    patientProfilId: AggregateID;
    energy: { [energyType: string]: NutrientNeedsValue };
    micronutrients: { [micronutrientName: string]: NutrientNeedsValue };
    macronutrients: { [macronutrientName: string]: NutrientNeedsValue };
    createdAt: string;
    updatedAt: string
}