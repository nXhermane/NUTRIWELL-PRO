import { AggregateRoot, EmptyStringError, ExceptionBase, Guard, HealthIndicator, IHealthIndicator, INeedsRecommendation, NeedsRecommendation, Result } from "@/core/shared";
import SmartCalc from "smartcal";
import { MedicalConditionRecommendationAddedEvent } from "../events/MedicalConditionRecommendationAddedEvent";
import { MedicalConditionRecommendationRemovedEvent } from "../events/MedicalConditionRecommendationRemovedEvent";
import { MedicalConditionHealthIndicatorAddedEvent } from "../events/MedicalConditionHealthIndicatorAddedEvent";
import { CreateStandardMedicalConditionProps } from "../types";

export type StandardMedicalConditionCriteria = {
   expression: string;
   variableMappingTable: { [variableName: string]: string };
};
export interface IStandardMedicalCondition {
   name: string;
   description: string;
   criteria: StandardMedicalConditionCriteria;
   defaultRecommendation: NeedsRecommendation[];
   healthIndicators: HealthIndicator[]
}

export class StandardMedicalCondition extends AggregateRoot<IStandardMedicalCondition> {
   get name(): string {
      return this.props.name;
   }
   set name(name: string) {
      this.props.name = name;
      this.validate();
   }

   get criteria(): StandardMedicalConditionCriteria {
      return this.props.criteria;
   }
   set criteria(criteria: StandardMedicalConditionCriteria) {
      this.props.criteria = criteria;
      this.validate();
   }
   get description(): string {
      return this.props.description;
   }
   set description(description: string) {
      this.props.description = description;
      this.validate();
   }

   get defaultRecommendation(): INeedsRecommendation<any>[] {
      return this.props.defaultRecommendation.map(recommendation => recommendation.unpack());
   }
   getRecommendations(): NeedsRecommendation[] {
      return this.props.defaultRecommendation
   }
   get healthIndicators(): IHealthIndicator[] {
      return this.props.healthIndicators.map(healthIndicator => healthIndicator.unpack())
   }
   addHealthIndicator(healthIndicator: HealthIndicator) {
      this.props.healthIndicators.push(healthIndicator);
      this.validate();
      this.addDomainEvent(new MedicalConditionHealthIndicatorAddedEvent({
         medicalConditionId: this.id,
         healthIndicator: healthIndicator,
      }))
   }

   addRecommendation(...recommendations: NeedsRecommendation[]) {
      recommendations.forEach((recommendation: NeedsRecommendation) => {
         this.props.defaultRecommendation.push(recommendation);
      });
      this.validate();
      this.addDomainEvent(new MedicalConditionRecommendationAddedEvent({
         medicalConditionId: this.id,
         recommendations: recommendations
      }))
   }
   removeHealthIndicator(healthIndicator: HealthIndicator): void {
      const index = this.props.healthIndicators.findIndex((val) => val.equals(healthIndicator));
      if (index !== -1) this.props.healthIndicators.splice(index, 1);
      this.validate();
      this.addDomainEvent(new MedicalConditionHealthIndicatorAddedEvent({
         medicalConditionId: this.id,
         healthIndicator: healthIndicator,
      }))
   }
   removeRecommendation(...recommendations: NeedsRecommendation[]) {
      recommendations.forEach((recommendation: NeedsRecommendation) => {
         const index = this.props.defaultRecommendation.findIndex((val) => val.equals(recommendation));
         if (index !== -1) this.props.defaultRecommendation.splice(index, 1);
      });
      this.validate();
      this.addDomainEvent(new MedicalConditionRecommendationRemovedEvent({
         medicalConditionId: this.id,
         recommendations: recommendations
      }))
   }

   getCriteriaMappingTable(): { [variableName: string]: string } {
      return this.props.criteria.variableMappingTable;
   }
   checkAndAssignMedicalCondition(context: { [key: string]: any }): boolean {
      const expression = this.props.criteria.expression;
      const result = SmartCalc(expression, context);
      return result === 1;
   }

   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom d'une condition medicale ne doit pas être vide.");
      this._isValid = true;
   }
   static create(createStandardMedicalConditionProps: CreateStandardMedicalConditionProps): Result<StandardMedicalCondition> {
      try {
         const healthIndicators = createStandardMedicalConditionProps.healthIndicators.map((healthIndicator) => HealthIndicator.create(healthIndicator))
         const healthIndicatorResult = Result.combine(healthIndicators)
         if (healthIndicatorResult.isFailure) return Result.fail<StandardMedicalCondition>(healthIndicatorResult.err)
         const standardMedicalCondition = new StandardMedicalCondition({
            props: {
               name: createStandardMedicalConditionProps.name,
               criteria: createStandardMedicalConditionProps.criteria,
               healthIndicators: healthIndicators.map(healthIndicator => healthIndicator.val),
               defaultRecommendation: createStandardMedicalConditionProps.defaultRecommendation,
               description: createStandardMedicalConditionProps.description
            }
         })
         return Result.ok<StandardMedicalCondition>(standardMedicalCondition)
      }
      catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<StandardMedicalCondition>(`[${error.code}]:${error.message}`)
            : Result.fail<StandardMedicalCondition>(`Erreur inattendue. ${StandardMedicalCondition?.constructor.name}`);

      }

   }
}
