import { PatientNeeds } from "../../entities/PatientNeeds";
import { PatientNeedsModel } from "../../entities/PatientNeedsModel";
import { PatientProfil } from "../../entities/PatientProfil";

export interface INutritionalNeedsCalculator {
   generatePatientNeeds(patientProfil: PatientProfil, patientNeedsModel: PatientNeedsModel): Promise<PatientNeeds>;
}
