import {
   ArgumentNotProvidedException,
   ArgumentOutOfRangeException,
   NutritionalSource,
   INutritionalSource,
   EmptyStringError,
   EnergyStaticTagname,
   Entity,
   Guard,
   MacronutrientStaticTagname,
   ModelType,
} from "@/core/shared";
import { NutrientDescriptor } from "../value-objects/NutrientDescriptor";
import { IPatientNeedsValidationRule, PatientNeedsValidationRule } from "../value-objects/PatientNeedsValidationRule";

// TODO : Maintenant je vais laisser la prise en charge de pathologies maintenant et reflechir par rapport a cela après quand le model serai pres .

// La creation de PatientNeedsModel sera fait dans le factory
export interface IPatientNeedsModel {
   modelType: ModelType;
   protocolName?: string; // Lors de la creation je vais utiliser le nutritional variable pour le generer
   protocolSource?: NutritionalSource;
   macronutrients: { [nutrientTagname: string]: NutrientDescriptor };
   micronutrients: { [nutrientTagname: string]: NutrientDescriptor };
   energyMetrics: { [nutrientTagname: string]: NutrientDescriptor };
   validationRules: PatientNeedsValidationRule[];
   isValidModel: boolean; // Attribue permettant de dire que ce model est déjà verifier par le sercice de validation
}

export class PatientNeedsModel extends Entity<IPatientNeedsModel> {
   get modelType(): "standard" | "specific" {
      return this.props.modelType;
   }
   get protocolSource(): INutritionalSource {
      return this.props.protocolSource?.unpack() as INutritionalSource;
   }
   get protocolName(): string {
      return this.props.protocolName as string;
   }
   getValidationRules(): IPatientNeedsValidationRule[] {
      return this.props.validationRules.map((rule) => rule.unpack());
   }
   getEnergyMetrics(): NutrientDescriptor[] {
      return Object.values(this.props.energyMetrics);
   }
   getMacronutrients(): NutrientDescriptor[] {
      return Object.values(this.props.macronutrients);
   }
   getMicronutrients(): NutrientDescriptor[] {
      return Object.values(this.props.micronutrients);
   }
   addNutrientToMacronutrients(...macronutrients: NutrientDescriptor[]) {
      this.updation();
      macronutrients.forEach((macronutrient) => (this.props.macronutrients[macronutrient.tagname] = macronutrient));
   }
   addNutrientToMicronutrients(...micronutrients: NutrientDescriptor[]) {
      this.updation();
      micronutrients.forEach((micronutrient) => (this.props.micronutrients[micronutrient.tagname] = micronutrient));
   }
   addNutrientToEnergyMetric(...energyMetrics: NutrientDescriptor[]) {
      this.updation();
      energyMetrics.forEach((energyMetric) => (this.props.energyMetrics[energyMetric.tagname] = energyMetric));
   }
   removeNutrientFromMacronutrients(...nutrientTagnames: string[]) {
      nutrientTagnames.forEach((tagname) => {
         if (this.props.macronutrients[tagname]) delete this.props.macronutrients[tagname];
      });
      this.updation();
   }
   removeNutrientFromMicronutrients(...nutrientTagnames: string[]) {
      nutrientTagnames.forEach((tagname) => {
         if (this.props.micronutrients[tagname]) delete this.props.micronutrients[tagname];
      });
      this.updation();
   }
   removeNutrientFromEnergyMetric(...nutrientTagnames: string[]) {
      nutrientTagnames.forEach((tagname) => {
         if (this.props.energyMetrics[tagname]) delete this.props.energyMetrics[tagname];
      });
      this.updation();
   }

   get isValidModel(): boolean {
      return this.props.isValidModel;
   }
   set isValidModel(value: boolean) {
      this.props.isValidModel = true;
   }
   private updation() {
      this.props.isValidModel = false;
   }
   public validate(): void {
      this._isValid = false;
      const neededMacronutrientTagname = Object.values(MacronutrientStaticTagname);
      const neededEnergyMetricTagname = Object.values(EnergyStaticTagname);
      const macronutrientsTagnames = Object.keys(this.props.macronutrients);
      const energyMetricsTagnames = Object.keys(this.props.energyMetrics);
      if (macronutrientsTagnames.length < 3)
         throw new ArgumentOutOfRangeException(
            "Au moin trois nutriments doit être fournir dans la catégorie des macronutriments lors de l'élaboration d'un patientNeedsModel.",
         );
      if (energyMetricsTagnames.length < 1)
         throw new ArgumentOutOfRangeException(
            "Au moin l'energy en kcal doit être defini dans la category energyMetrics lors de l'élaboration d'un patientNeedsModel.",
         );
      if (neededMacronutrientTagname.every((tagname) => macronutrientsTagnames.includes(String(tagname))))
         throw new ArgumentNotProvidedException(
            "Pour les macronutriments lors de la definition d'un patientNeedsModel , on doit avoir les trois principaux macronutriments au minimum.",
         );
      if (neededEnergyMetricTagname.some((tagname) => energyMetricsTagnames.includes(String(tagname))))
         throw new ArgumentNotProvidedException(
            "Pour la categorie energy metric , au moin l'energy doit être integré soit en KJ soit en Kcal. Veillez verifier votre definition du patientNeedsModel pour y ajouter l'expression de calcule de l'energy.",
         );
      if (this.props.modelType === ModelType.Standard && Guard.isEmpty(this.props.protocolName).succeeded)
         throw new EmptyStringError("Si le patientNeedsModel est standard , le nom du protocole doit être definir.");
      this._isValid = true;
   }
}
