import { CreatePatientErrors } from "./CreatePatientErrors";
import { CreatePatientRequest } from "./CreatePatientRequest";
import { CreatePatientResponse } from "./CreatePatientResponse";
import { CreatePatientProps, Patient } from "./../../../../domain";
import { UseCase, FileManager, Image, Result, AppError, left, right ,AggregateID} from "@shared";
import { PatientRepository, PatientRepositoryError } from "./../../../../infrastructure";

export class CreatePatientUseCase implements UseCase<CreatePatientRequest, CreatePatientResponse> {
   constructor(
      private patientRepo: PatientRepository,
      private fileManager: FileManager,
   ) {}

   async execute(request: CreatePatientRequest): Promise<CreatePatientResponse> {
      try {
         const patient = Patient.create({
            ...request,
         });
         if (patient.isFailure) return left(new CreatePatientErrors.PatientFactoryError(patient.err));
         const images = await Promise.all(
            patient.val.getImage().map(
               async (img: Image) =>
                  await this.fileManager.save({
                     file: img,
                     dirname: patient.val.id + "_" + patient.val.name,
                  }),
            ),
         );
         patient.val.images = images as Image[];
         await this.patientRepo.save(patient.val);
         return right(Result.ok<AggregateID>(patient.val.id));
      } catch (e) {
         if (e instanceof PatientRepositoryError) return left(new CreatePatientErrors.PatientRepoError(e));
         return left(new AppError.UnexpectedError(e));
      }
   }
}
