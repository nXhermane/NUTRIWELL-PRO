import { AggregateID } from "@/core/shared";
import { StandardMedicalConditionDto } from "@/core/StandardRecommendationsManager/infrastructure";

export type UpdateStandardMedicalConditionRequest = {
   standardMedicalConditionId: AggregateID;
   data: UpdateStandardMedicalConditionDto;
};
export type UpdateStandardMedicalConditionDto = Partial<Omit<StandardMedicalConditionDto, "id" | "recommendations" | "healthIndicators">>;
