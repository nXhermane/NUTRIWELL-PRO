import { AggregateID, NeedsRecommendationDto } from "@/core/shared";

export type AddRecommendationToStandardObjectiveRequest = {
   standardObjectiveId: AggregateID;
   recommendations: NeedsRecommendationDto[];
};
