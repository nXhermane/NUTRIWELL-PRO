import { AggregateID } from "@/core/shared";

export interface PatientDataVariableDto {
   id: AggregateID;
   patientId: AggregateID;
   variables: Record<string, string>;
   createdAt: string;
   updatedAt: string;
}
