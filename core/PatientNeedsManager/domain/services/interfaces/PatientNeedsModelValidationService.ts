import { PatientNeedsModel } from "../../entities/PatientNeedsModel";

export interface IPatientNeedsModelValidationService {
   validate(patientNeedsModel: PatientNeedsModel): Promise<boolean>;
}
