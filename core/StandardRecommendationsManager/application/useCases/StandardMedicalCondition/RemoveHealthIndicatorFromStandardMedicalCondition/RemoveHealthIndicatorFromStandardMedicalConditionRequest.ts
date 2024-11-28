import { AggregateID, IHealthIndicator } from "@/core/shared";

export type RemoveHealthIndicatorFromStandardMedicalConditionRequest = {
   standardMedicalConditionId: AggregateID;
   healthIndicators: IHealthIndicator[];
};
