import { AggregateID } from "@/core/shared";
import { PatientNeeds } from "../../entities/PatientNeeds";
import { PatientNeedsModel } from "../../entities/PatientNeedsModel";

export interface INutritionalStandardNeedsCalculator {
   generatePatientNeeds(patientProfilId: AggregateID, patientNeedsModel: PatientNeedsModel): Promise<PatientNeeds>;
}
