import { AggregateID, Result, AppError, Either } from "@shared";
import { CreateFoodDiaryErrors } from "./CreateFoodDiaryErrors";
export type CreateFoodDiaryResponse = Either<
   | AppError.UnexpectedError
   | CreateFoodDiaryErrors.MedicalRecordNotFoundError
   | CreateFoodDiaryErrors.MedicalRecordRepoError
   | CreateFoodDiaryErrors.FoodDiaryFactoryError,
   Result<AggregateID>
>;
