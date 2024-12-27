import { AggregateID } from "@/core/shared";

export type DeleteVariableFromPatientDataVariableRequest = {
   patientDataVariableId: AggregateID;
   variableName: string;
};
