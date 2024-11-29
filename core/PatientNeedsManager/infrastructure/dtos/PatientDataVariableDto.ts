import { AggregateID } from "@/core/shared";

export interface PatientDataVariableDto {
   id: AggregateID;
   patientProfilId: AggregateID;
   variables: Record<string, string>;
   createdAt: string;
   updatedAt: string;
}
