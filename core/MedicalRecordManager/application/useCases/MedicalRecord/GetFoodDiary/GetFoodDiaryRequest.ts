import { AggregateID } from "@shared";
export type GetFoodDiaryRequest = {
   foodDiaryId: AggregateID;
   patientId: AggregateID;
};
