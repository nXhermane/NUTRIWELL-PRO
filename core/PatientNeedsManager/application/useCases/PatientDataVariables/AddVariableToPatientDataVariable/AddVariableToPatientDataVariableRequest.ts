import { AggregateID } from "@/core/shared";

export type AddVariableToPatientDataVariableRequest = {
   patientDataVariableId: AggregateID;
   variables: { variableName: string; variablePath: string }[];
};
