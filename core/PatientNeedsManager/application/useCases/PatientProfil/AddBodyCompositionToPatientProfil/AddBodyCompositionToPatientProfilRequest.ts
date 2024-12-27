import { CreateHealthMetricsProps } from "@/core/PatientNeedsManager/domain/value-objects/types";
import { AggregateID } from "@/core/shared";

export type AddBodyCompositionToPatientProfilRequest = {
   patientProfilIdOrPatientId: AggregateID;
   bodyCompositions: CreateHealthMetricsProps[];
};
