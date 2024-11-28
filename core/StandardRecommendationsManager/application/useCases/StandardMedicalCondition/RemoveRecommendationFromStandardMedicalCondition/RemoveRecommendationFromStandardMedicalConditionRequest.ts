import { AggregateID, NeedsRecommendationDto } from "@/core/shared";

export type RemoveRecommendationFromStandardMedicalConditionRequest = {
   standardMedicalConditionId: AggregateID;
   recommendations: NeedsRecommendationDto[];
};
