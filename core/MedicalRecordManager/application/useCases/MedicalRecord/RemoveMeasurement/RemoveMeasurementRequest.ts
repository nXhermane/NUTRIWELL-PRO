import { AggregateID } from "@/core/shared";
import { CreateMeasurementProps } from "./../../../../domain";

export type RemoveMeasurementRequest = {
   measurements: CreateMeasurementProps[];
   patientId: AggregateID;
};
