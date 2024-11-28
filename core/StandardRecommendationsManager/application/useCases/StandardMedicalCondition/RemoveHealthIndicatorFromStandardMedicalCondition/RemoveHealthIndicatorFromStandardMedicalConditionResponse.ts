import { AppError, Either, Result } from "@/core/shared";
import { RemoveHealthIndicatorFromStandardMedicalConditionErrors } from "./RemoveHealthIndicatorFromStandardMedicalConditionErrors";
import { RemoveRecommendationFromStandardMedicalConditionErrors } from "../RemoveRecommendationFromStandardMedicalCondition";

export type RemoveHealthIndicatorFromStandardMedicalConditionResponse = Either<
   | RemoveHealthIndicatorFromStandardMedicalConditionErrors.HealthIndicatorCreationFailed
   | RemoveHealthIndicatorFromStandardMedicalConditionErrors.StandardMedicalConditionRepoError
   | RemoveRecommendationFromStandardMedicalConditionErrors.StandardMedicalConditionValidationError
   | RemoveHealthIndicatorFromStandardMedicalConditionErrors.StandardMedicalConditionnNotFoundError
   | AppError.UnexpectedError,
   Result<boolean>
>;
