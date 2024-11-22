import { IQuantity, AggregateID } from "@shared";

export type CreateMeasurementProps = {
   measurementCategory: "Antropometry" | "MedicalAnalysis" | "BodyComposition";
   date: Date;
   measureTypeId: AggregateID;
   value: number;
   unit: string;
};
export type CreateEatingBehaviorProps = {
   date: Date;
   eatingBehavior: string;
};
export type CreateObjectiveProps = {
   type: "Measure" | "General";
   timeframe: { start: Date; end: Date };
   body:
      | {
           value: number;
           description: string;
           measureTypeId: string;
        }
      | { description: string };
};
export type FoodItemProps = {
   foodId?: AggregateID;
   recipeId?: AggregateID;
   isRecipe: boolean;
   isHomeMade: boolean;
   quantity: IQuantity;
};
export type FoodMealEntryProps = {
   withCompany: boolean;
   watchingTv: boolean;
   sittingAtTable: boolean;
   foodItems: FoodItemProps[];
   mealTypeId: AggregateID;
   description: string;
};
export type CreateFoodDiaryProps = {
   date: Date;
   meal: FoodMealEntryProps;
   observation: string;
   images: string[];
};
export type CreateFoodStoryProps = {
   bedtime?: string;
   wakeUpTime?: string;
   dietTypes?: AggregateID[];
   favoriteFoods?: { name: string; foodId: AggregateID }[];
   foodAversions?: { name: string; foodId: AggregateID }[];
   allergies?: AggregateID[];
   foodIntolerances?: AggregateID[];
   nutritionalDeficiencies?: AggregateID[];
   waterConsumption?: {
      lowerBound: number;
      upperBound: number | null;
   };
   numberOfMealsPerDay?: number;
   otherInformation?: string;
};
export type CreateMedicalStoryProps = {
   pathologies?: string;
   drugie?: string;
   personalBackground?: string;
   familyBackground?: string;
   otherInformation?: string;
};
export type CreatePersonalAndSocialStoryProps = {
   gastrointestinalState?: "Regular" | "Diarrhea" | "Constipation" | "Irregular";
   sleepQuality?: "Very good" | "Good" | "Fair" | "Poor" | "Very poor";
   isSmoker?: boolean;
   isAlcoholConsumer?: boolean;
   maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed";
   physicalActivity?: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   ethnicity?: "Caucasian" | "Asian" | "Black";
   otherInformation?: string;
};
export type CreateConsultationInformationProps = {
   consultationMotive?: string;
   expectations?: string;
   clinicalObjective?: string;
   otherInformation?: string;
};
export type CreateMedicalRecordProps = {
   medicalStory?: CreateMedicalStoryProps;
   foodStory?: CreateFoodStoryProps;
   personalAndSocialStory?: CreatePersonalAndSocialStoryProps;
   consultationInformation?: CreateConsultationInformationProps;
};
