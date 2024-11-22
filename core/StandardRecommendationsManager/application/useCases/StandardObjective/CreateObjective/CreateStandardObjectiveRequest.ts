import { NeedsRecommendationDto } from "@/core/shared";
import { CreateStandardObjectiveProps } from "@/core/StandardRecommendationsManager/domain";
export type CreateStandardObjectiveRequest = Omit<CreateStandardObjectiveProps, "defaultRecommendation"> & {
    recommendations: NeedsRecommendationDto[]
}