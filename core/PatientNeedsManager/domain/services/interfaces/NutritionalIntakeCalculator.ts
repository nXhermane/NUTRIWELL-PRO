import { AggregateID, CDate, Result } from "@/core/shared";

export interface INutritionalIntakeCalculator {
   calculateDailyIntake(patientId: AggregateID, date?: CDate): Promise<Result<DailyIntake>>;
   calculateIntakeOverPeriod(patientId: AggregateID, period: { start: CDate; end?: CDate }): Promise<Result<OverPeriodIntake>>;
}
export type DailyIntake = {
   date: CDate;
   foodOrRecipeIds: AggregateID[];
   nutrients: { [key: string]: { value: number; unit: string; }; };
};
export type OverPeriodIntake = {
   period: { start: CDate; end?: CDate; };
   foodOrRecipeIds: AggregateID[];
   nutrients: { [key: string]: { value: number; unit: string; }; };
};
