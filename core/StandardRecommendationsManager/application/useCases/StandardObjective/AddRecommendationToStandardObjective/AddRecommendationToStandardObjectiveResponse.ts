import { AggregateID, AppError, Either, Result } from "@/core/shared";
import { AddRecommendationToStandardObjectiveErrors } from "./AddRecommendationToStandardObjectiveErrors";

export type AddRecommendationToStandardObjectiveResponse = Either<
   | AppError.UnexpectedError
   | AddRecommendationToStandardObjectiveErrors.StandardObjectiveNotFoundError
   | AddRecommendationToStandardObjectiveErrors.StandardObjectiveRepoError
   | AddRecommendationToStandardObjectiveErrors.StandardObjectiveValidationError
   | AddRecommendationToStandardObjectiveErrors.NeedsRecommendationCreationFailed,
   Result<void>
>;
