import { AggregateID } from "@/core/shared";
import { StandardObjectiveDto } from "@/core/StandardRecommendationsManager/infrastructure";

export type UpdateStandardObjectiveRequest = {
   standardObjectiveId: AggregateID;
   data: UpdateStandardObjectiveDto;
};
export type UpdateStandardObjectiveDto = Partial<Omit<StandardObjectiveDto, "recommendations" | "id">>;
