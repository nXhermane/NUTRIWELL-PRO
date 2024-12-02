import { AggregateID, Entity, ExceptionBase, Guard, InvalidReference, Result } from "@/core/shared";
import { CreatePatientNeedsProps } from "./types";

export type NutrientNeedsValue = { value: number; unit: string };
export interface IPatientNeeds {
   patientProfilId: AggregateID;
   energy: { [energyType: string]: NutrientNeedsValue };
   micronutrients: { [micronutrientName: string]: NutrientNeedsValue };
   macronutrients: { [macronutrientName: string]: NutrientNeedsValue };
}

export class PatientNeeds extends Entity<IPatientNeeds> {
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.patientProfilId).succeeded)
         throw new InvalidReference("La reference vers le profil du patient doit être fournir et ne doit être vide.");
      this._isValid = true;
   }
   setEnergy(energy: { [key: string]: NutrientNeedsValue }) {
      this.props.energy = energy;
      this.validate();
   }
   setMicronutrients(micronutrients: { [key: string]: NutrientNeedsValue }) {
      this.props.micronutrients = micronutrients;
      this.validate();
   }
   setMacronutrients(macronutrients: { [key: string]: NutrientNeedsValue }) {
      this.props.macronutrients = macronutrients;
      this.validate();
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
