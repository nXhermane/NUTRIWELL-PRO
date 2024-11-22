import { BaseEntityProps } from "@shared";

export interface PersonalAndSocialStoryDto extends BaseEntityProps {
   gastrointestinalState: "Regular" | "Diarrhea" | "Constipation" | "Irregular";
   sleepQuality: "Very good" | "Good" | "Fair" | "Poor" | "Very poor";
   isSmoker: boolean;
   isAlcoholConsumer: boolean;
   maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
   physicalActivity: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   ethnicity: "Caucasian" | "Asian" | "Black";
   otherInformation: string;
}
