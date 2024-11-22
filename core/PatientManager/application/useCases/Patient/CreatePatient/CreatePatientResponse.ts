import { Either, AppError, Result, AggregateID } from "@shared";
import { CreatePatientErrors } from "./CreatePatientErrors";
export type CreatePatientResponse = Either<
   AppError.UnexpectedError | CreatePatientErrors.PatientRepoError | CreatePatientErrors.PatientFactoryError,
   Result<AggregateID>
>;
