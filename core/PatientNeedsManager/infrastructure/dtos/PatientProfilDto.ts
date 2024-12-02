import { AggregateID } from "@/core/shared";
import { IHealthMetrics } from "../../domain/value-objects/HealthMetrics";

export interface PatientProfilDto {
   id: AggregateID;
   patientId: AggregateID;
   patientNeedsModelId: AggregateID;
   gender: "M" | "F" | "O";
   age: number;
   height: number;
   weight: number;
   physicalActivityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   anthropometricMeasure: Record<string, IHealthMetrics>;
   bodyCompositionMeasure: Record<string, IHealthMetrics>;
   medicalAnalyses: Record<string, IHealthMetrics>;
   medicalConditionIds: AggregateID[];
   objectiveIds: AggregateID[];
   otherInformations: Record<string, any>;
}
