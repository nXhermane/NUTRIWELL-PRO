import { AggregateID } from "@shared";
import { CreateMedicalStoryProps } from "./../../../../domain";
export type UpdateMedicalStoryRequest = {
   patientId: AggregateID;
   data: Partial<CreateMedicalStoryProps>;
};
