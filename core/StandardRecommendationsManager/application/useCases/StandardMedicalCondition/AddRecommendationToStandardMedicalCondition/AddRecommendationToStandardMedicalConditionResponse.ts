import { AppError, Either, Result } from "@/core/shared";
import { AddRecommendationToStandardMedicalConditionErrors } from "./AddRecommendationToStandardMedicalConditionErrors";

export type AddRecommendationToStandardMedicalConditionResponse = Either<
   | AppError.UnexpectedError
   | AddRecommendationToStandardMedicalConditionErrors.NeedsRecommendationCreationFailed
   | AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionRepoError
   | AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionValidationError
   | AddRecommendationToStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError,
   Result<void>
>;
