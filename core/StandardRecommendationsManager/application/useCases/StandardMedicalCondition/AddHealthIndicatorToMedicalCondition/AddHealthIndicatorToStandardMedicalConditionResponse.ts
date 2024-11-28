import { AppError, Either, Result } from "@/core/shared";
import { AddHealthIndicatorToStandardMedicalConditionErrors } from "./AddHealthIndicatorToStandardMedicalConditionErrors";

export type AddHealthIndicatorToMedicalConditionResponse = Either<
   | AddHealthIndicatorToStandardMedicalConditionErrors.HealthIndicatorCreationFailed
   | AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionNotFoundError
   | AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionRepoError
   | AddHealthIndicatorToStandardMedicalConditionErrors.StandardMedicalConditionValidationError
   | AppError.UnexpectedError,
   Result<void>
>;
