import {
   AggregateID,
   ArgumentInvalidException,
   CDate,
   EmptyStringError,
   Entity,
   ExceptionBase,
   Guard,
   INeedsRecommendation,
   ITimeframe,
   NeedsRecommendation,
   NegativeValueError,
   ObjectiveStatus,
   ObjectiveType,
   Result,
   Timeframe,
} from "@/core/shared";
import { CreateObjectiveProps } from "./types";

export interface IObjective {
   name: string;
   type: ObjectiveType;
   status: ObjectiveStatus;
   description: string;
   unit?: string;
   timeframe: Timeframe;
   measureCode?: string;
   initialValue?: number;
   targetValue?: number;
   currentValue?: number;
   recommendations: NeedsRecommendation[];
   standardObjectiveId?: AggregateID;
}

export class Objective extends Entity<IObjective> {
   get name(): string {
      return this.props.name;
   }
   set name(name: string) {
      this.props.name = name;
      this.validate();
   }
   get type(): "Measure" | "General" {
      return this.props.type;
   }
   set type(type: "Measure" | "General") {
      this.props.type = type as ObjectiveType;
      this.validate();
   }
   get status(): "InProgress" | "Achieved" | "NotAchieved" {
      return this.props.status;
   }
   set status(status: "InProgress" | "Achieved" | "NotAchieved") {
      this.props.status = status as ObjectiveStatus;
      this.validate();
   }
   get description(): string {
      return this.props.description;
   }
   set desciption(desc: string) {
      this.props.description = desc;
      this.validate();
   }
   get unit(): string | undefined {
      return this.props?.unit;
   }
   set unit(unit: string) {
      this.props.unit = unit;
      this.validate();
   }
   get timeframe(): ITimeframe {
      return this.props.timeframe.unpack();
   }
   set timeframe(timeframe: Timeframe) {
      this.props.timeframe = timeframe;
      this.validate();
   }
   get measureCode(): string | undefined {
      return this.props?.measureCode;
   }
   set measureCode(measureCode: string) {
      this.props.measureCode = measureCode;
      this.validate();
   }
   get initialValue(): number | undefined {
      return this.props?.initialValue;
   }
   set initialValue(initValue: number) {
      this.props.initialValue = initValue;
      this.validate();
   }
   get targetValue(): number | undefined {
      return this.props?.targetValue;
   }
   set targetValue(targetValue: number) {
      this.props.targetValue = targetValue;
      this.validate();
   }
   get currentValue(): number | undefined {
      return this.props?.currentValue;
   }
   set currentValue(currentValue: number) {
      this.props.currentValue = currentValue;
      this.validate();
      this.updateStatusBasedOnProgress();
   }
   get standardObjectiveId(): AggregateID | undefined {
      return this.props.standardObjectiveId;
   }
   get recommendations(): INeedsRecommendation<any>[] {
      return this.props.recommendations.map((recommendation) => recommendation.unpack());
   }
   getRecommendation(): NeedsRecommendation[] {
      return this.props.recommendations;
   }
   addRecommendations(...recommendations: NeedsRecommendation[]): void {
      recommendations.forEach((recommendation) => {
         this.props.recommendations.push(recommendation);
      });
      this.validate();
   }
   removeRecommendations(...recommendations: NeedsRecommendation[]) {
      recommendations.forEach((recommendation: NeedsRecommendation) => {
         const index = this.props.recommendations.findIndex((val) => val.equals(recommendation));
         if (index !== -1) this.props.recommendations.splice(index, 1);
      });
      this.validate();
   }
   getValueProgression(): number {
      if (!this.props.initialValue || !this.props.targetValue || !this.props.currentValue) return 0;
      const progress =
         (Math.abs(this.props.initialValue - this.props.currentValue) * 100) / Math.abs(this.props.targetValue - this.props.initialValue);
      return progress <= 100 ? progress : 100;
   }
   getDateProgression(): number {
      const currentDate = new CDate().getDate();
      const startDate = this.props.timeframe.unpack().start.getDate();
      const endDate = this.props.timeframe.unpack().end.getDate();
      if (!startDate || !endDate) return 0;
      const totalTime = endDate.getTime() - startDate.getTime();
      const elapsedTime = currentDate.getTime() - startDate.getTime();
      return (elapsedTime / totalTime) * 100;
   }
   getProgression(): number {
      return this.props.type === ObjectiveType.General ? this.getDateProgression() : this.getValueProgression();
   }
   public updateStatusBasedOnProgress(): void {
      const valueProgression = this.getValueProgression();
      const dateProgression = this.getDateProgression();
      if (valueProgression >= 100 && dateProgression >= 100) {
         this.props.status = ObjectiveStatus.Achieved;
      } else if (valueProgression >= 100 && dateProgression < 100) {
         this.props.status = ObjectiveStatus.NotAchieved;
      } else {
         this.props.status = ObjectiveStatus.InProgress;
      }
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom de l'objectif ne doit être vide.");
      if (this.props.type === ObjectiveType.Measure) {
         if (Guard.isEmpty(this.props.measureCode).succeeded) throw new EmptyStringError("Le code de mesure ne doit être vide.");
         if (Guard.isEmpty(this.props.unit).succeeded) throw new EmptyStringError("L'unié de la measure ne doit être vide .");
         if (!this.props.initialValue || Guard.isNegative(this.props.initialValue as number).succeeded)
            throw new NegativeValueError(
               "La valeur initial ne doit être négative ou doit être fournir si vous utilisez un objectif de type 'Measure'.",
            );
         if (!this.props.targetValue || Guard.isNegative(this.props.targetValue as number).succeeded)
            throw new NegativeValueError(
               "La valeur a atteindre ne doit être négative ou doit être fournir si vous utilisez un objectif de type 'Measure'.",
            );
         if (!this.props.currentValue || Guard.isNegative(this.props.currentValue).succeeded)
            throw new NegativeValueError(
               "La valeur actuelle ne doit être négative ou doit être fournir si vous utilisez un objectif de type 'Measure'.",
            );
      }
      this.updateStatusBasedOnProgress();
      this._isValid = true;
   }
   static create(createObjectiveProps: CreateObjectiveProps): Result<Objective> {
      try {
         const timeframe = Timeframe.create(createObjectiveProps.timeframe);
         if (timeframe.isFailure) return Result.fail<Objective>("Erreur lors de la creation de l'intervalle de temps pour l'objectif du patient.");
         const objective = new Objective({
            props: {
               name: createObjectiveProps.name,
               type: createObjectiveProps.type as ObjectiveType,
               status: createObjectiveProps.status as ObjectiveStatus,
               description: createObjectiveProps.description,
               unit: createObjectiveProps.unit,
               timeframe: timeframe.val,
               measureCode: createObjectiveProps.measureCode,
               initialValue: createObjectiveProps.initialValue,
               targetValue: createObjectiveProps.targetValue,
               recommendations: createObjectiveProps.recommendations,
               standardObjectiveId: createObjectiveProps.standardObjectiveId,
            },
         });
         return Result.ok<Objective>(objective);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Objective>(`[${error.code}]:${error.message}`)
            : Result.fail<Objective>(`Erreur inattendue. ${Objective?.constructor.name}`);
      }
   }
}
