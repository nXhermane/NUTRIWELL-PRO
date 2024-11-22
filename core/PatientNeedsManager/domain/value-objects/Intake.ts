import { AggregateID, CDate, ExceptionBase, Result, ValueObject } from "@shared";
import { CreateIntakeDataProps } from "../types";

export interface IIntake {
   foodOrRecipeId: AggregateID;
   isRecipe: boolean;
   date: CDate;
   nutrients: Map<string, { value: number; unit: string }>;
}

export class Intake extends ValueObject<IIntake> {
   isTheSameDay(intake: Intake): boolean {
      return this.props.date.isSameDay(intake.unpack().date);
   }
   protected validate(props: IIntake): void {
      throw new Error("Method not implemented.");
   }
   static create(createIntakeProps: CreateIntakeDataProps): Result<Intake> {
      try {
         const date = new CDate(createIntakeProps.date);
         const isRecipe = createIntakeProps.isRecipe;
         const foodOrRecipeId = createIntakeProps.foodOrRecipeId;
         const nutrients = new Map<string, { value: number; unit: string }>();
         createIntakeProps.nutrients.forEach((nutrient: { value: number; tagname: string; unit: string }) => {
            const { tagname, value, unit } = nutrient;
            nutrients.set(tagname, {
               value,
               unit,
            });
         });
         const intake = new Intake({ date, isRecipe, foodOrRecipeId, nutrients });
         return Result.ok<Intake>(intake);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Intake>(`[${error.code}]:${error.message}`)
            : Result.fail<Intake>(`Erreur inattendue. ${Intake?.constructor.name}`);
      }
   }
}
