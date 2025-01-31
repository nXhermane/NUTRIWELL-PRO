import { AggregateID } from "@/core/shared";
import { HealthMetricPersistence } from "../repositories";

export interface PatientProfilDto {
   id: AggregateID;
   patientId: AggregateID;
   patientNeedsModelId: AggregateID;
   gender: "M" | "F" | "O";
   age: number;
   height: number;
   weight: number;
   physicalActivityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   healthMetrics: HealthMetricPersistence[];
   medicalConditionIds: AggregateID[];
   objectiveIds: AggregateID[];
   otherInformations: Record<string, any>;
}
