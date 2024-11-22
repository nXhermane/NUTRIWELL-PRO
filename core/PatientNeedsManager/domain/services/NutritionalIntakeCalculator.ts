import { AggregateID, CDate, Result } from "@/core/shared";
import { DailyIntake, INutritionalIntakeCalculator, OverPeriodIntake } from "./interfaces/NutritionalIntakeCalculator";
import { IIntakeDataACL } from "../../application";
import { Intake } from "../value-objects/Intake";

export class NutritionalIntakeCalculator implements INutritionalIntakeCalculator {
   constructor(private intakeACL: IIntakeDataACL) {}
   async calculateDailyIntake(patientId: AggregateID, date?: CDate): Promise<Result<DailyIntake>> {
      try {
         const intakeResult = await this.intakeACL.getIntakeByPatientId(patientId);
         if (intakeResult.isFailure) return Result.fail<DailyIntake>(String(intakeResult.err));
         const dayIntakes = intakeResult.val.filter((value: Intake) => value.unpack().date.isSameDay(date || new CDate()));
         const intakeReport = {
            date: date || new CDate(),
            foodOrRecipeIds: dayIntakes.map((intake: Intake) => intake.unpack().foodOrRecipeId),
            nutrients: this.calculateNutrientSum(dayIntakes),
         };
         return Result.ok<DailyIntake>(intakeReport);
      } catch (error) {
         return Result.fail<DailyIntake>(String(error));
      }
   }
   async calculateIntakeOverPeriod(patientId: AggregateID, period: { start: CDate; end?: CDate }): Promise<Result<OverPeriodIntake>> {
      try {
         const intakeResult = await this.intakeACL.getIntakeByPatientId(patientId);
         if (intakeResult.isFailure) return Result.fail<OverPeriodIntake>(String(intakeResult.err));
         const periodIntake = intakeResult.val.filter((intake: Intake) => {
            const intakeDate = intake.unpack().date;
            return (
               intakeDate.isAfter(period.start) ||
               intakeDate.isBefore(period?.end || new CDate()) ||
               intakeDate.isSameDay(period.start) ||
               intakeDate.isSameDay(period?.end || new CDate())
            );
         });
         const intakeReport = {
            period: { start: period.start, end: period.end || new CDate() },
            foodOrRecipeIds: periodIntake.map((value: Intake) => value.unpack().foodOrRecipeId),
            nutrients: this.calculateNutrientSum(periodIntake),
         };
         return Result.ok<OverPeriodIntake>(intakeReport);
      } catch (error) {
         return Result.fail<OverPeriodIntake>(String(error));
      }
   }

   private calculateNutrientSum(intakes: Intake[]): { [key: string]: { value: number; unit: string } } {
      const intakeData: { [key: string]: { value: number; unit: string } } = {};
      intakes.forEach((intake: Intake) => {
         const { nutrients } = intake.unpack();
         for (const nutrientKey of Object.keys(nutrients)) {
            if (intakeData[nutrientKey]) {
               const lastValue = intakeData[nutrientKey];
               const newValue = nutrients.get(nutrientKey)!;
               intakeData[nutrientKey] = {
                  value: lastValue.value + newValue.value,
                  unit: lastValue.unit,
               };
            } else {
               intakeData[nutrientKey] = nutrients.get(nutrientKey)!;
            }
         }
      });
      return intakeData;
   }
}
