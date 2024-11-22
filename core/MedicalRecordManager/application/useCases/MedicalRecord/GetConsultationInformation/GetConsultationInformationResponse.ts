import { AggregateID, Either, Result, AppError } from "@shared";
import { GetConsultationInformationErrors } from "./GetConsultationInformationErrors";
import { ConsultationInformationDto } from "./../../../../infrastructure";
export type GetConsultationInformationResponse = Either<
   AppError.UnexpectedError | GetConsultationInformationErrors.MedicalRecordNotFoundError,
   Result<ConsultationInformationDto>
>;
