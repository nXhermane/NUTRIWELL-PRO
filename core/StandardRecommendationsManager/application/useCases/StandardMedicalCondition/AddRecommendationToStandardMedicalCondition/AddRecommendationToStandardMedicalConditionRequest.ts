import { AggregateID, NeedsRecommendationDto } from "@/core/shared";

export type AddRecommendationToStandardMedicalConditionRequest = {
   standardMedicalConditionId: AggregateID;
   recommendations: NeedsRecommendationDto[];
};
