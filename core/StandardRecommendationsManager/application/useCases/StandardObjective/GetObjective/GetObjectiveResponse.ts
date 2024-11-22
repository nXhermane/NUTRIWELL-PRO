import { AppError, Either, Result } from "@/core/shared";
import { GetStandardObjectiveErrors } from "./GetObjectiveErrors";
import { StandardObjectiveDto } from "@/core/StandardRecommendationsManager/infrastructure";

export type GetStandardObjectiveResponse = Either<AppError.UnexpectedError | GetStandardObjectiveErrors.ObjectiveNotFoundError, Result<StandardObjectiveDto | StandardObjectiveDto[]>>