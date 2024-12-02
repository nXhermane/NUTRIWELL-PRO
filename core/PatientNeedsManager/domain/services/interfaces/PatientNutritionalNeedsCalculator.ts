import { AggregateID } from "@/core/shared";
import { PatientNeeds } from "../../entities/PatientNeeds";

export interface IPatientNutritionalNeedsCalculator {
    generatePatientNeeds(patientProfilId: AggregateID): Promise<PatientNeeds>
}