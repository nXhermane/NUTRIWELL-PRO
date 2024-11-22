import { AggregateID, BaseEntityProps } from "@shared";
import { CreateFoodDiaryProps } from "./../../../../domain";
export type UpdateFoodDiaryRequest = {
   patientId: AggregateID;
   data: Partial<CreateFoodDiaryProps> & BaseEntityProps;
};
