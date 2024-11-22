import { BaseEntityProps, AggregateID } from "@shared";

export interface FoodStoryDto extends BaseEntityProps {
   bedtime: string;
   wakeUpTime: string;
   dietTypes: AggregateID[];
   favoriteFoods: { name: string; foodId: AggregateID }[];
   foodAversions: { name: string; foodId: AggregateID }[];
   allergies: AggregateID[];
   foodIntolerances: AggregateID[];
   nutritionalDeficiencies: AggregateID[];
   waterConsumption: {
      lowerBound: number;
      upperBound: number | null;
   };
   numberOfMealsPerDay: number;
   otherInformation: string;
}
