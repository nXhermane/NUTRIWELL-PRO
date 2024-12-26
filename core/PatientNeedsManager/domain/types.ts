import { AggregateID } from "@shared";
import { IMedicalCondition } from "./entities/MedicalCondition";
import { HealthMetrics } from "./value-objects/HealthMetrics";
import { IHealthIndicator } from "../../shared/modules/NeedsRecommendations/value-object/HealthIndicator";
import { CreateObjectiveProps, VariableMappingTable } from "./entities/types";

export interface CreatePatientProfilProps {
   patientId: AggregateID;
   patientNeedsModelId: AggregateID;
   age: number;
   gender: "M" | "F" | "O";
   height: number;
   weight: number;
   physicalActivityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active";
   objective: CreateObjectiveProps[];
   medicalCondition: CreateMedicalConditionProps[];
   anthropomethricMeasure: { [measureCode: string]: HealthMetrics };
   bodyComposition: { [measureCode: string]: HealthMetrics };
   medicalAnalyses: { [measureCode: string]: HealthMetrics };
   otherInformations: { [infoName: string]: any };
}
export type CreatePatientDataVariableProps = {
   patientProfilId: AggregateID;
   variables: { [variableName: string]: string };
};
export interface CreateMedicalConditionProps extends Omit<IMedicalCondition, "severity" | "healthIndicators"> {
   severity: "light" | "moderate" | "severe";
   healthIndicators: IHealthIndicator[];
}

export type CreateValidationRegularProps = {
   expression: string;
   nutrientInsolved: string[];
   otherVariables: VariableMappingTable;
};
