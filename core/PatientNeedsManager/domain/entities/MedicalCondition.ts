import { EmptyStringError, Entity, ExceptionBase, Guard, HealthIndicator, INeedsRecommendation, MedicalConditionSeverity, NeedsRecommendation, Result, ValueObject } from "@shared";
import { CreateMedicalConditionProps } from "../types";
/**
 * Il existe deux type de recommandation pour une condition medicale , nous avons ceux qui concerne les besoins nutritionel et ceux concernant  l'alimentation
 * Mais dans ce bounded context , nous accepterons uniquement les recommandation concernant les besoins on tiendra compte des autres types de recommandation dans dáutre contexte
 * Pour ce contexte, nous devons ajouter un champ supplémentaire pour stocker les autres informations concernant la condition médicale comme par exemple la durée de l'exposition à la condition, les symptômes spécifiques, etc...
 * Ce champ est un objet avec des clés et des valeurs qui peuvent être de n'importe quel type, il est donc important de déclarer le type des valeurs pour que TypeScript puis
 */

/**
  * La recommandation ici concerne les besoins 
  * caracteriser par une condition qui doit etre respecter avant l'application de la recommandation
  * la recomandation {
   par rapport a l'energy : {[energytype: string]: recommNDtion sous forme de string qui peut etre evaluer par le smart cal
   par rapport au macronutriment 
   pAR RApport au micronutriment } 
 }


  * TODO : je dois ajouter quelque chose d'interessant au medical Condition , les pathologies ont tous des biomarqueurs a surveillers donc interger l'ajout de biomarqueur va permetre ;la prise en charge d'execution d'action en cas de modification des biomarqueurs
  */
export interface IMedicalCondition {
   name: string;
   severity: MedicalConditionSeverity;
   recommendations: NeedsRecommendation[];
   otherInformation: { [key: string]: any };
   healthIndicators: HealthIndicator[]
}

export class MedicalCondition extends Entity<IMedicalCondition> {
   get name(): string {
      return this.props.name;
   }
   set name(value: string) {
      this.props.name = value;
      this.validate();
   }
   get severity(): "light" | "moderate" | "severe" {
      return this.props.severity;
   }
   set severity(value: "light" | "moderate" | "severe") {
      this.props.severity = value as MedicalConditionSeverity;
   }
   get recommendation(): INeedsRecommendation<any>[] {
      return this.props.recommendations.map(recommendation => recommendation.unpack());
   }
   addRecommandation(...recommandations: NeedsRecommendation[]) {
      this.props.recommendations.push(...recommandations);
      this.validate();
   }
   set recommandation(recommandations: NeedsRecommendation[]) {
      this.props.recommendations = recommandations;
      this.validate();
   }
   addHealthIndicator(healthIndicator: HealthIndicator): void {
      this.props.healthIndicators.push(healthIndicator);
      this.validate();
   }
   set healthIndicators(healthIndicators: HealthIndicator[]) {
      this.props.healthIndicators = healthIndicators;
      this.validate();
   }
   addOrdersInformations(informationName: string, informationValue: any) {
      this.props.otherInformation[informationName] = informationValue;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom d'un condition médicalud ne doit etre vide");
      this._isValid = true;
   }
   static create(props: CreateMedicalConditionProps): Result<MedicalCondition> {
      try {
         const healthIndicators = props.healthIndicators.map(HealthIndicator.create)
         if (Result.combine(healthIndicators).isFailure) {
            return Result.fail<MedicalCondition>("Erreur lors de la création des indicateurs de santé");
         }
         const medicalCond = new MedicalCondition({
            props: {
               name: props.name,
               severity: props.severity as MedicalConditionSeverity,
               recommendations: props.recommendations,
               otherInformation: props.otherInformation,
               healthIndicators: healthIndicators.map(healthIndicatorResult => healthIndicatorResult.val)
            },
         });
         return Result.ok<MedicalCondition>(medicalCond);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<MedicalCondition>(`[${error.code}]:${error.message}`)
            : Result.fail<MedicalCondition>(`Erreur inattendue. ${MedicalCondition?.constructor.name}`);
      }
   }
}
