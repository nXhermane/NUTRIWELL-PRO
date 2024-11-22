import { AggregateID } from "@shared";
import { CreateFoodStoryProps } from "./../../../../domain";
export type UpdateFoodStoryRequest = {
   patientId: AggregateID;
   data: Partial<CreateFoodStoryProps>;
};
