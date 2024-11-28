import { AppError, Either, Result } from "@/core/shared";
import { GetStandardMedicalConditionErrors } from "./GetStandardMedicalConditionErrors";
import { StandardMedicalConditionDto } from "@/core/StandardRecommendationsManager/infrastructure";

export type GetStandardMedicalConditionResponse = Either<
   AppError.UnexpectedError | GetStandardMedicalConditionErrors.MedicalConditionNotFoundError,
   Result<StandardMedicalConditionDto | StandardMedicalConditionDto[]>
>;
