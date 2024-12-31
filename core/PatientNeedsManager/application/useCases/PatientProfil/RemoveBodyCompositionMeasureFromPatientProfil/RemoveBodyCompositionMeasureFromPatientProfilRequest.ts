import { AggregateID } from "@/core/shared";

export type RemoveBodyCompositionMeasureFromPatientProfilRequest = {
   patientProfilIdOrPatientId: AggregateID;
   bodyCompositionMeasureCode: string[];
};
