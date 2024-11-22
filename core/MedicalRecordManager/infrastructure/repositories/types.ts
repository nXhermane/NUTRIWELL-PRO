import { AggregateID, IQuantity } from "@shared";
import {
   IWaterConsumptionRange,
   FoodStory,
   MedicalStory,
   Objective,
   FoodDiary,
   PatientMeasurements,
   PersonalAndSocialStory,
   ConsultationInformation,
} from "./../../domain";
import { TimeFrame, Measurement } from "./../database/medicalRecord.schema";
export interface Timestamps {
   createdAt: string;
   updatedAt: string;
}
export type EatingBehavior = {
   date: string;
   eatingBehavior: string;
};

export type MealType = {
   withCompany: boolean;
   watchingTv: boolean;
   sittingAtTable: boolean;
   foodItems: {
      foodId?: number | string;
      recipeId?: number | string;
      isRecipe: boolean;
      isHomeMade: boolean;
      quantity: IQuantity;
   }[];
   mealTypeId: number | string;
   description: string;
};
export type FoodType = { name: string; foodId: number | string };
export interface FoodDiaryPersistenceType extends Timestamps {
   id: AggregateID;
   date: string;
   meal: MealType;
   observation: string;
   images: string[];
}
export type ObjectiveBody =
   | {
        measureTypeId: number | string;
        value: number;
        description?: string;
     }
   | { description: string };
export interface ConsultationInformationPersistenceType extends Timestamps {
   id: AggregateID;
   consultationMotive: string;
   expectations: string;
   clinicalObjective: string;
   otherInformation: string;
}
export interface FoodStoryPersistenceType extends Timestamps {
   id: AggregateID;
   bedtime: string;
   wakeUpTime: string;
   dietTypes: AggregateID[];
   favoriteFoods: FoodType[];
   foodAversions: FoodType[];
   allergies: AggregateID[];
   foodIntolerances: AggregateID[];
   nutritionalDeficiencies: AggregateID[];
   waterConsumption: IWaterConsumptionRange;
   numberOfMealsPerDay: number;
   otherInformation: string;
}
export interface MedicalStoryPersistenceType extends Timestamps {
   id: AggregateID;
   pathologies: string;
   drugie: string;
   personalBackground: string;
   familyBackground: string;
   otherInformation: string;
}
export interface ObjectivePersistenceType extends Timestamps {
   id: AggregateID;
   type: "Measure" | "General";
   timeframe: TimeFrame;
   body: ObjectiveBody;
   status: "InProgress" | "Achieved" | "NotAchieved";
}
export interface PersonalAndSocialStoryPersistenceType extends Timestamps {
   id: AggregateID;
   gastrointestinalState: "Regular" | "Diarrhea" | "Constipation" | "Irregular";
   sleepQuality: "Very good" | "Good" | "Fair" | "Poor" | "Very poor";
   isSmoker: boolean;
   isAlcoholConsumer: boolean;
   maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
   physicalActivity: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   ethnicity: "Caucasian" | "Asian" | "Black";
   otherInformation: string;
}
export interface PatientMeasurementPersistenceType extends Timestamps {
   id: AggregateID;
   anthropometricMeasurements: Measurement[];
   bodyCompositionMeasurements: Measurement[];
   medicalAnalysisResults: Measurement[];
}
export interface MedicalRecordTableType extends Timestamps {
   id: AggregateID;
   status: "Active" | "New" | "Inactive";
   eatingBehaviors: string;
}
export interface MedicalRecordPersistenceType extends Timestamps {
   id: string;
   patientId: string;
   medicalStoryId: string;
   foodStoryId: string;
   foodDiaryIds: AggregateID[];
   objectiveIds: AggregateID[];
   patientMeasurementId: string;
   personalAndSocialStorieId: string;
   consultationInformationId: string;
   status: "Active" | "New" | "Inactive";
   eatingBehaviors: EatingBehavior[];
}

export interface MedicalRecordPersistenceRecordType extends Timestamps {
   id: AggregateID;
   patientId: AggregateID;
   foodStory: FoodStory;
   medicalStory: MedicalStory;
   objectives: Objective[];
   foodDiaries: FoodDiary[];
   patientMeasurements: PatientMeasurements;
   personalAndSocialStory: PersonalAndSocialStory;
   status: "Active" | "New" | "Inactive";
   eatingBehaviors: EatingBehavior[];
   consultationInformation: ConsultationInformation;
}
