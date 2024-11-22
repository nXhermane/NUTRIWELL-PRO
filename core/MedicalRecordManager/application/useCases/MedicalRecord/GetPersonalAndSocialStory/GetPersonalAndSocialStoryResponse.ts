import { AggregateID, Either, Result, AppError } from "@shared";
import { PersonalAndSocialStoryDto } from "./../../../../infrastructure";
import { GetPersonalAndSocialStoryErrors } from "./GetPersonalAndSocialStoryErrors";
export type GetPersonalAndSocialStoryResponse = Either<
   AppError.UnexpectedError | GetPersonalAndSocialStoryErrors.MedicalRecordNotFoundError,
   Result<PersonalAndSocialStoryDto>
>;
