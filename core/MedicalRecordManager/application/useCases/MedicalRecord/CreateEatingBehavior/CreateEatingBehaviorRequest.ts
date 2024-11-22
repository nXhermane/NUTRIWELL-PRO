import { CreateEatingBehaviorProps } from "./../../../../domain";
import { AggregateID } from "@shared";
export type CreateEatingBehaviorRequest = {
   data: CreateEatingBehaviorProps;
   patientId: AggregateID;
};
