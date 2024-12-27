import { AggregateID } from "@/core/shared";

export type UpdatePatientProfilRequest = {
   patientProfilIdOrPatientId: AggregateID;
   age?: number;
   height?: number;
   weight?: number;
   gender?: "M" | "F" | "O";
   physicalActivityLevel?: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   otherInformations?: { [infoName: string]: string };
   patientNeedsModelId?: AggregateID;
};
