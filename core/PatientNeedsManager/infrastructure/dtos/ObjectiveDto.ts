import { AggregateID, INeedsRecommendation, ITimeframe } from "@/core/shared";

export interface ObjectiveDto {
   id: AggregateID;
   name: string;
   type: "General" | "Measure";
   status: "Achieved" | "NotAchieved" | "Achieved";
   description: string;
   unit?: string;
   timeframe: ITimeframe;
   measureCode?: string;
   initialValue?: number;
   targetValue?: number;
   currentValue?: number;
   recommendations: INeedsRecommendation<any>[];
   standardObjectiveId?: AggregateID;
   createdAt: string;
   updatedAt: string;
}
