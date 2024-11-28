import { AggregateID, AppServiceResponse, Message } from "@/core/shared";
import {
   AddRecommendationToStandardObjectiveRequest,
   CreateStandardObjectiveRequest,
   DeleteStandardObjectiveRequest,
   GetStandardObjectiveRequest,
   RemoveRecommendationFromStandardObjectiveRequest,
   UpdateStandardObjectiveRequest,
} from "../../useCases";
import { StandardObjectiveDto } from "@/core/StandardRecommendationsManager/infrastructure";

export interface IStandardObjectiveService {
   createStandardObjective(req: CreateStandardObjectiveRequest): Promise<AppServiceResponse<{ standardObjectiveId: AggregateID }> | Message>;
   deleteStandardObjective(req: DeleteStandardObjectiveRequest): Promise<AppServiceResponse<boolean> | Message>;
   getStandardObjective(req: GetStandardObjectiveRequest): Promise<AppServiceResponse<StandardObjectiveDto | StandardObjectiveDto[]> | Message>;
   updateStandardObjective(req: UpdateStandardObjectiveRequest): Promise<AppServiceResponse<void> | Message>;
   addRecommendationToStandardObjective(req: AddRecommendationToStandardObjectiveRequest): Promise<AppServiceResponse<void> | Message>;
   removeRecommendationFromStandardObjective(req: RemoveRecommendationFromStandardObjectiveRequest): Promise<AppServiceResponse<boolean> | Message>;
}
