import { AggregateID } from "@/core/shared";
import { HealthMetricsPersistence } from "../repositories";

export interface PatientProfilDto {
   id: AggregateID;
   patientId: AggregateID;
   patientNeedsModelId: AggregateID;
   gender: "M" | "F" | "O";
   age: number;
   height: number;
   weight: number;
   physicalActivityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   anthropometricMeasure:HealthMetricsPersistence[]
   bodyCompositionMeasure: HealthMetricsPersistence[]
   medicalAnalyses: HealthMetricsPersistence[]
   medicalConditionIds: AggregateID[];
   objectiveIds: AggregateID[];
   otherInformations: Record<string, any>;
}
