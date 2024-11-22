import { CreateObjectiveProps } from "./../../../../domain";
import { AggregateID } from "@shared";
export type CreateObjectiveRequest = {
   data: CreateObjectiveProps;
   patientId: AggregateID;
};
