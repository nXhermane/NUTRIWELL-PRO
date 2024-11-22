import { AggregateID, Result, AppError, Either } from "@shared";
import { SignUpErrors } from "./SignUpErrors";
export type SignUpResponse = Either<
   AppError.UnexpectedError | SignUpErrors.NutritionistAuthServiceError | SignUpErrors.NutritionistFactoryError,
   Result<void>
>;
