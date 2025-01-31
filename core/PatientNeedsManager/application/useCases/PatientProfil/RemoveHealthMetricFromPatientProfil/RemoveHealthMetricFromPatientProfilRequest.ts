import { AggregateID } from "@/core/shared";

export type RemoveHealthMetricFromPatientProfilRequest = {
   patientProfilIdOrPatientId: AggregateID;
   healthMetricCodes: string[];
};
