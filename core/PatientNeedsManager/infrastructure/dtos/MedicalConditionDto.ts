import { AggregateID, IHealthIndicator, INeedsRecommendation } from "@/core/shared";

export interface MedicalConditionDto {
   id: AggregateID;
   name: string;
   standardMedicalConditionId?: AggregateID;
   severity: "severe" | "light" | "moderate";
   description: string;
   recommendations: INeedsRecommendation<any>[];
   otherInformation: { [key: string]: any };
   healthIndicators: IHealthIndicator[];
   createdAt: string;
   updatedAt: string;
}
