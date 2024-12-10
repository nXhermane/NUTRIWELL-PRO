import { PatientNeeds } from "../../entities/PatientNeeds";
import { PatientProfil } from "../../aggregates/PatientProfil";
import { PatientNeedsModel } from "../../entities/PatientNeedsModel";

export interface INutritionalStandardNeedsCalculator {
   generatePatientNeeds(patientProfil: PatientProfil, patientNeedsModel: PatientNeedsModel): Promise<PatientNeeds>;
}
