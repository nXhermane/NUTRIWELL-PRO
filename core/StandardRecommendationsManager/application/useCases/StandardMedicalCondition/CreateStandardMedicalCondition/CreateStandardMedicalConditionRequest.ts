import { NeedsRecommendationDto } from "@/core/shared";
import { CreateStandardMedicalConditionProps } from "@/core/StandardRecommendationsManager/domain";

export type CreateStandardMedicalConditionRequest = Omit<CreateStandardMedicalConditionProps, "defaultRecommendation"> & {
   recommendations: NeedsRecommendationDto[];
};
