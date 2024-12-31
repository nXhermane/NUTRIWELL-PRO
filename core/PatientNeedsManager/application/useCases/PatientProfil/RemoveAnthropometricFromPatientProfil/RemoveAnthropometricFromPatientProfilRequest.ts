import { AggregateID } from "@/core/shared";

export type RemoveAnthropometricFromPatientProfilRequest = {
   patientProfilIdOrPatientId: AggregateID;
   anthropometricMeasureCode: string[];
};
