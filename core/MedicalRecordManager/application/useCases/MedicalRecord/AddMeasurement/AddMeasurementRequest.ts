import { CreateMeasurementProps } from "./../../../../domain";
import { AggregateID } from "@shared";
export type AddMeasurementRequest = {
   data: CreateMeasurementProps;
   patientId: AggregateID;
};
