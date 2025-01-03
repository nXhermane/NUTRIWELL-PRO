import { CreateMeasurementProps } from "./../../../../domain";
import { AggregateID } from "@shared";
export type AddMeasurementRequest = {
   measurements: CreateMeasurementProps[];
   patientId: AggregateID;
};
