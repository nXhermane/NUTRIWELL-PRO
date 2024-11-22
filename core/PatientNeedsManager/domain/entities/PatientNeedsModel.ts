import { EmptyStringError, Entity, ExceptionBase, Guard, IQuantity, Result } from "@/core/shared";

export type NutrientNeedsCalculationModel = {
   isFormular: boolean;
   value: string;
   variables: { [key: string]: string };
   unit: string;
};
export type Energy = { [energyType: string]: NutrientNeedsCalculationModel };
export type Macronutrients = { [nutrientName: string]: NutrientNeedsCalculationModel };
export type Micronutrients = { [nutrientName: string]: NutrientNeedsCalculationModel };
export interface IPatientNeedsModel {
   energy: Energy;
   macronutrients: Macronutrients;
   micronutrients: Micronutrients;
}

export class PatientNeedsModel extends Entity<IPatientNeedsModel> {
   public validate(): void {
      const isValidEnergy = Object.values(this.props.energy).every((n) => Guard.isEmpty(n.value).succeeded);
      const hasValidMacronutrients = Object.values(this.props.macronutrients).every((n) => Guard.isEmpty(n.value).succeeded);
      const hasValidMicronutrients = Object.values(this.props.micronutrients).every((n) => Guard.isEmpty(n.value).succeeded);
      if (!isValidEnergy || !hasValidMacronutrients || !hasValidMicronutrients)
         throw new EmptyStringError("Les données de besoins n'ont pas été correctement renseignées.");
      this._isValid = isValidEnergy && hasValidMacronutrients && hasValidMicronutrients;
   }
   addNutrientToMacroNutrient(nutrientName: string, nutrientModel: NutrientNeedsCalculationModel) {
      this._isValid = false;
      this.props.macronutrients[nutrientName] = nutrientModel;
      this.validate();
   }
   addNutrientToMicronutrient(nutrientName: string, nutrientModel: NutrientNeedsCalculationModel) {
      this._isValid = false;
      this.props.micronutrients[nutrientName] = nutrientModel;
      this.validate();
   }

   addEnergyModel(energyType: string, nutrientModel: NutrientNeedsCalculationModel) {
      this._isValid = false;
      this.props.energy[energyType] = nutrientModel;
      this.validate();
   }

   removeNutrientFromMacroNutrient(nutrientName: string) {
      this._isValid = false;
      delete this.props.macronutrients[nutrientName];
      this.validate();
   }
   removeNutrientFromMicronutrient(nutrientName: string) {
      this._isValid = false;
      delete this.props.micronutrients[nutrientName];
      this.validate();
   }
   removeEnergyModel(energyType: string) {
      this._isValid = false;
      delete this.props.energy[energyType];
      this.validate();
   }
   static create(props: IPatientNeedsModel): Result<PatientNeedsModel> {
      try {
         const patientNeedsModel = new PatientNeedsModel({ props: props });
         patientNeedsModel.validate();
         return Result.ok<PatientNeedsModel>(patientNeedsModel);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<PatientNeedsModel>(`[${error.code}]:${error.message}`)
            : Result.fail<PatientNeedsModel>(`Erreur inattendue. ${PatientNeedsModel?.constructor.name}`);
      }
   }
}
