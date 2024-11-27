import { AppError, Either, Result } from "@/core/shared";
import { RemoveRecommendationFromStandardObjectiveErrors } from "./RemoveRecommendationFromStandardObjectiveErrors";

export type RemoveRecommendationFromStandardObjectiveResponse = Either<
   | RemoveRecommendationFromStandardObjectiveErrors.RecommendationNotFoundOnStandardObjective
   | RemoveRecommendationFromStandardObjectiveErrors.StandardObjectiveNotFoundError
   | RemoveRecommendationFromStandardObjectiveErrors.StandardObjectiveNotFoundError
   | RemoveRecommendationFromStandardObjectiveErrors.NeedsRecommendationCreationFailed
   | AppError.UnexpectedError,
   Result<boolean>
>;
