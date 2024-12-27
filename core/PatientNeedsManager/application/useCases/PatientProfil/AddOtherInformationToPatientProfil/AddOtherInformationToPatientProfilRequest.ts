import { AggregateID } from "@/core/shared";

export type AddOtherInformationToPatientProfilRequest = {
   patientProfilIdOrPatientId: AggregateID;
   otherInformations: { [infoName: string]: any };
};
