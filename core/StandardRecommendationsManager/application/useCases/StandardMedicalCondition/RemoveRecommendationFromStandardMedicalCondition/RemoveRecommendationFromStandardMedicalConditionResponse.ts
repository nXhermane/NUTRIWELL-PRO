import { AppError, Either, Result } from "@/core/shared";
import { RemoveRecommendationFromStandardMedicalConditionErrors } from "./RemoveRecommendationFromStandardMedicalConditionErrors";

export type RemoveRecommendationFromStandardMedicalConditionResponse = Either<
   | AppError.UnexpectedError
   | RemoveRecommendationFromStandardMedicalConditionErrors.NeedsRecommendationCreationFailed
   | RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionRepoError
   | RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionValidationError
   | RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError,
   Result<boolean>
>;
