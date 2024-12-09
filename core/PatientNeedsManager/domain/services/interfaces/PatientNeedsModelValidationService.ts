import { PatientNeedsModel } from "../../entities/PatientNeedsModel.next"


export interface IPatientNeedsModelValidationService {
    validate(patientNeedsModel: PatientNeedsModel): Promise<boolean>
}