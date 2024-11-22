import {
   Entity,
   CreateEntityProps,
   Guard,
   ArgumentInvalidException,
   ArgumentNotProvidedException,
   NegativeValueError,
   EmptyStringError,
   InvalidReference,
   Timeframe,
   ITimeframe,
   ObjectiveType,
   ObjectiveStatus,
   AggregateID,
   NutritionData,
   CDate,
   DateManager,
   ExceptionBase,
   Result,
   AppServiceResponse,
} from "./../../../shared";
import { CreateObjectiveProps } from "./../types";
export interface IObjective {
   type: ObjectiveType;
   timeframe: Timeframe;
   measureTypeId?: AggregateID;
   value?: number;
   description?: string;
   status: ObjectiveStatus;
}
// des regles doit etre inclure dans l'objectif afin de dire exactement ce que l'objectif veux dire des regles comme diminuer glucide de 30%
export class Objective extends Entity<IObjective> {
   constructor(createObjective: CreateEntityProps<IObjective>) {
      super(createObjective);
   }
   get type(): ObjectiveType {
      return this.props.type;
   }
   get timeframe(): ITimeframe {
      return this.props.timeframe.unpack();
   }
   get measureTypeId(): AggregateID | undefined {
      return this.props?.measureTypeId;
   }
   get value(): number | undefined {
      return this.props?.value;
   }
   get description(): string {
      return this.props.description || "";
   }
   get status(): ObjectiveStatus {
      if (this.props.timeframe.isExpire && this.props.status === ObjectiveStatus.InProgress) {
         return ObjectiveStatus.NotAchieved;
      } else {
         return this.props.status;
      }
   }
   set type(type: ObjectiveType) {
      this.props.type = type;
      if (this.isMeasure()) {
         if (Guard.isEmpty(this.props.value).succeeded) this.props.value = 1;
         if (Guard.isEmpty(this.props.measureTypeId).succeeded) this.props.measureTypeId = 2;
      }
      this.validate();
   }
   set status(status: ObjectiveStatus) {
      if (this.props.timeframe.isExpire && status === ObjectiveStatus.InProgress) {
         this.props.status = ObjectiveStatus.NotAchieved;
      } else {
         this.props.status = status as ObjectiveStatus;
      }
   }
   set description(val: string) {
      this.props.description = val;
   }
   set value(val: number | undefined) {
      this.props.value = val;
      this.validate();
   }
   set measureTypeId(typeId: AggregateID) {
      this.props.measureTypeId = typeId;
      this.validate();
   }
   set timeframe(frame: Timeframe) {
      this.props.timeframe = frame;
      this.status = ObjectiveStatus.InProgress;
   }
   isMeasure(): boolean {
      return this.props.type === ObjectiveType.Measure;
   }
   validateMeasureId(measureIds: AggregateID[]): void {
      if (this.isMeasure()) {
         if (!measureIds.includes(this.props.measureTypeId as AggregateID)) throw new InvalidReference("L'id du measure de l'objective est invalid.");
      }
   }
   validate(): void {
      if (Guard.isEmpty(this.props.type).succeeded) throw new ArgumentNotProvidedException("Le type d'objective doit etre fournit.");
      if (this.props.type === ObjectiveType.Measure) {
         const isValidMeasureObjective = !Guard.isEmpty(this.props.value).succeeded || !Guard.isEmpty(this.props.measureTypeId).succeeded;
         if (!isValidMeasureObjective) {
            throw new ArgumentNotProvidedException("Pour un objective de type Measure , la valeur et le type de mesure doit etre fournir.");
            if ((this.props.value as number) < 0) throw new NegativeValueError("La valeur du measure ne peut etre inferieur a zéro.");
         }
      } else if (this.props.type === ObjectiveType.General) {
         const isValidGeneralObjectie =
            !Guard.isEmpty(this.props.description).succeeded &&
            Guard.isEmpty(this.props.value).succeeded &&
            Guard.isEmpty(this.props.measureTypeId).succeeded;
         if (!isValidGeneralObjectie) throw new EmptyStringError("Pour un objective de type Generale , la description doit etre fournir.");
      } else {
         throw new ArgumentInvalidException("Le type d'objective est invalide ou non prise en charge.");
      }
   }
   static async create(objective: CreateObjectiveProps): Promise<Result<Objective>> {
      try {
         const timeframe = new Timeframe({
            start: new CDate(DateManager.formatDate(objective.timeframe.start)),
            end: new CDate(DateManager.formatDate(objective.timeframe.end)),
         });
         const type = objective.type as ObjectiveType;
         const status = ObjectiveStatus.InProgress;
         const newObjective = new Objective({
            props: { timeframe, type, status, ...objective.body },
         });
         if (newObjective.isMeasure()) {
            const measureIds = (
               (await (await NutritionData.getInstance()).measurement.getAllMeasureTypeId({})) as AppServiceResponse<
                  {
                     id: AggregateID;
                     code: string;
                  }[]
               >
            ).data.map((data: { id: AggregateID; code: string }) => data.id);
            newObjective.validateMeasureId(measureIds);
         }
         return Result.ok<Objective>(newObjective);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Objective>(`[${e.code}]:${e.message}`)
            : Result.fail<Objective>(`Erreur inattendue. ${Objective.constructor.name}`);
      }
   }
}
