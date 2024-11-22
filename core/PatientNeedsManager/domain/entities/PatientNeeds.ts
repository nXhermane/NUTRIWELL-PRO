import { AggregateID, Entity, ExceptionBase, Result } from "@/core/shared";
import { CreatePatientNeedsProps } from "./types";

export type NutrientNeedsValue = { value: number; unit: string };
export interface IPatientNeeds {
   patientId: AggregateID;
   energy: { [energyType: string]: NutrientNeedsValue };
   micronutrients: { [micronutrientName: string]: NutrientNeedsValue };
   macronutrients: { [macronutrientName: string]: NutrientNeedsValue };
}

export class PatientNeeds extends Entity<IPatientNeeds> {
   public validate(): void {
      throw new Error("Method not implemented.");
   }

   static create(props: CreatePatientNeedsProps): Result<PatientNeeds> {
      try {
         const patientNeeds = new PatientNeeds({ props: props });
         return Result.ok<PatientNeeds>(patientNeeds);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<PatientNeeds>(`[${error.code}]:${error.message}`)
            : Result.fail<PatientNeeds>(`Erreur inattendue. ${PatientNeeds?.constructor.name}`);
      }
   }
}
