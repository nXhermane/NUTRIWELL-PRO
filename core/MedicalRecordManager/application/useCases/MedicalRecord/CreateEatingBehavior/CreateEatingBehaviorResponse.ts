import { EatingBehaviorDto } from "./../../../../infrastructure";
import { AggregateID, Either, Result, AppError } from "@shared";
import { CreateEatingBehaviorErrors } from "./CreateEatingBehaviorErrors";

export type CreateEatingBehaviorResponse = Either<
   | AppError.UnexpectedError
   | CreateEatingBehaviorErrors.MedicalRecordNotFoundError
   | CreateEatingBehaviorErrors.MedicalRecordRepoError
   | CreateEatingBehaviorErrors.EatingBehaviorFactoryError,
   Result<EatingBehaviorDto>
>;
