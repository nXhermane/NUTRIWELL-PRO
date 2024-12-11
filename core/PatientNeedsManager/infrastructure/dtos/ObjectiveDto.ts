import { AggregateID, INeedsRecommendation, ITimeframe, NeedsRecommendationDto } from "@/core/shared";

export interface ObjectiveDto {
   id: AggregateID;
   name: string;
   type: "General" | "Measure";
   status: "InProgress" | "Achieved" | "NotAchieved";
   description: string;
   unit?: string;
   timeframe: ITimeframe;
   measureCode?: string;
   initialValue?: number;
   targetValue?: number;
   currentValue?: number;
   recommendations: NeedsRecommendationDto[];
   standardObjectiveId?: AggregateID;
   createdAt: string;
   updatedAt: string;
}
