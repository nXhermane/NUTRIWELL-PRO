import { Result, Either, AppError } from "@shared";
import { UpdateConsultationInformationErrors } from "./UpdateConsultationInformationErrors";
export type UpdateConsultationInformationResponse = Either<
   | AppError.UnexpectedError
   | UpdateConsultationInformationErrors.MedicalRecordNotFoundError
   | UpdateConsultationInformationErrors.MedicalRecordRepoError,
   Result<void>
>;
