import { AggregateID, NeedsRecommendationDto } from "@/core/shared";
export type RemoveRecommendationFromStandardObjectiveRequest = {
   standardObjectiveId: AggregateID;
   recommendations: NeedsRecommendationDto[];
};
