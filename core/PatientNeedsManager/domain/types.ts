import { AggregateID } from "@shared";
import { ICurrentGoal } from "./value-objects/CurrentGoal";
import { IMedicalCondition } from "./entities/MedicalCondition";
import { HealthMetrics } from "./value-objects/HealthMetrics";
import { IHealthIndicator } from "../../shared/modules/NeedsRecommendations/value-object/HealthIndicator";

export interface CreatePatientProfilProps {
   patientId: AggregateID;
   age: number;
   gender: "M" | "F" | "O";
   height: number;
   weight: number;
   physicalActivityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   currrentGoal?: ICurrentGoal;
   medicalCondition: CreateMedicalConditionProps[];
   anthropomethricMeasure: { [measureCode: string]: HealthMetrics };
   bodyComposition: { [measureCode: string]: HealthMetrics };
   medicalAnalyses: { [measureCode: string]: HealthMetrics };
   otherInformations: { [infoName: string]: any };
}
export type CreatePatientDataVariable = {
   patientId: AggregateID;
   variables: { [variableName: string]: string };
};
export interface CreateMedicalConditionProps extends Omit<IMedicalCondition, "severity"| "healthIndicators"> {
   severity: "light" | "moderate" | "severe";
   healthIndicators: IHealthIndicator[]
}

export type CreateIntakeDataProps = {
   date: string;
   foodOrRecipeId: AggregateID;
   isRecipe: boolean;
   nutrients: {
      value: number;
      tagname: string;
      unit: string;
   }[];
};
