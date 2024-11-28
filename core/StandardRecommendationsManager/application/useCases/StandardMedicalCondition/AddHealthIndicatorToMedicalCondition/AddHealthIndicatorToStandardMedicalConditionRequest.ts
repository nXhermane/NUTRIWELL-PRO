import { AggregateID, IHealthIndicator } from "@/core/shared";

export type AddHealthIndicatorToMedicalConditionRequest = {
   standardMedicalConditionId: AggregateID;
   healthIndicatords: IHealthIndicator[];
};
