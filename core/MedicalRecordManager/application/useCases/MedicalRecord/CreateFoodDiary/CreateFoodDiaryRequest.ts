import { CreateFoodDiaryProps } from "./../../../../domain";
import { AggregateID } from "@shared";
export type CreateFoodDiaryRequest = {
   data: CreateFoodDiaryProps;
   patientId: AggregateID;
};
