import { AggregateID, IHealthIndicator, INeedsRecommendation, NeedsRecommendationDto } from "@/core/shared";
import { HealthMetricsPersistence } from "../repositories";

export interface MedicalConditionDto {
   id: AggregateID;
   name: string;
   standardMedicalConditionId?: AggregateID;
   severity: "severe" | "light" | "moderate";
   description: string;
   recommendations: NeedsRecommendationDto[];
   otherInformation: { [key: string]: any };
   healthIndicators: HealthMetricsPersistence[];
   createdAt: string;
   updatedAt: string;
}
