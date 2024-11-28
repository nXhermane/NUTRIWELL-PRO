import { AggregateID, AppServiceResponse, Message } from "@/core/shared";
import {
   AddHealthIndicatorToMedicalConditionRequest,
   AddRecommendationToStandardMedicalConditionRequest,
   CreateStandardMedicalConditionRequest,
   DeleteStandardMedicalConditionRequest,
   GetStandardMedicalConditionRequest,
   RemoveHealthIndicatorFromStandardMedicalConditionRequest,
   RemoveRecommendationFromStandardMedicalConditionRequest,
   UpdateStandardMedicalConditionRequest,
} from "../../useCases";
import { StandardMedicalConditionDto } from "@/core/StandardRecommendationsManager/infrastructure";

export interface IStandardMedicalConditionService {
   createStandardMedicalCondition(
      req: CreateStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<{ standardMedicalConditionId: AggregateID }> | Message>;
   deleteStandardMedicalCondition(req: DeleteStandardMedicalConditionRequest): Promise<AppServiceResponse<boolean> | Message>;
   getStandardMedicalCondition(
      req: GetStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<StandardMedicalConditionDto | StandardMedicalConditionDto[]> | Message>;
   updateStandardMedicalCondition(req: UpdateStandardMedicalConditionRequest): Promise<AppServiceResponse<void> | Message>;
   addRecommendationToStandardMedicalCondition(req: AddRecommendationToStandardMedicalConditionRequest): Promise<AppServiceResponse<void> | Message>;
   addHealthIndicatorToStandardMedicalCondition(req: AddHealthIndicatorToMedicalConditionRequest): Promise<AppServiceResponse<void> | Message>;
   removeRecommendationFromStandardMedicalCondition(
      req: RemoveRecommendationFromStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<boolean> | Message>;
   removeHealthIndicatorFromStandardMedicalCondition(
      req: RemoveHealthIndicatorFromStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<boolean> | Message>;
}
