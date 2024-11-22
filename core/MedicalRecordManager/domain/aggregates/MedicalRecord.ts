import { AggregateRoot, CreateEntityProps, BaseEntityProps, AggregateID, ExceptionBase, Result, ObjectCreationError } from "@shared";
import { FoodDiary, IFoodDiary } from "./../entities/FoodDiary";
import { ConsultationInformation, IConsultationInformation } from "./../entities/ConsultationInformation";
import { FoodStory, IFoodStory } from "./../entities/FoodStory";
import { MedicalStory, IMedicalStory } from "./../entities/MedicalStory";
import { Objective, IObjective } from "./../entities/Objective";
import { PersonalAndSocialStory, IPersonalAndSocialStory } from "./../entities/PersonalAndSocialStory";
import { PatientMeasurements, IPatientMeasurements } from "./../entities/PatientMeasurements";
import { EatingBehavior, IEatingBehavior } from "./../value-objects/EatingBehavior";
import { IAnthropometricMeasurement, AnthropometricMeasurement } from "./../value-objects/AnthropometricMeasurement";
import { IBodyCompositionMeasurement, BodyCompositionMeasurement } from "./../value-objects/BodyCompositionMeasurement";
import { IMedicalAnalysisResult, MedicalAnalysisResult } from "./../value-objects/MedicalAnalysisResult";
import { CreateMedicalRecordProps } from "./../types";
import { MeasurementAddedEvent, ObjectiveAddedEvent, ObjectiveRemovedEvent, objectiveUpdatedEvent, PatientMeasurementUpdatedEvent } from "../events";
export interface IMedicalRecord {
   foodDiaries: FoodDiary[];
   consultationInformation: ConsultationInformation;
   measure: PatientMeasurements;
   foodStory: FoodStory;
   medicalStory: MedicalStory;
   objectives: Objective[];
   personalAndSocialStory: PersonalAndSocialStory;
   eatingBehaviors: EatingBehavior[];
   patientId: AggregateID;
}

export class MedicalRecord extends AggregateRoot<IMedicalRecord> {
   constructor(createMediaclRecordProps: CreateEntityProps<IMedicalRecord>) {
      super(createMediaclRecordProps);
   }
   get patientId(): AggregateID {
      return this.props.patientId;
   }
   addMeasurement(...measurements: (AnthropometricMeasurement | MedicalAnalysisResult | BodyCompositionMeasurement)[]) {
      measurements.forEach((measurement) => {
         switch (measurement.constructor) {
            case AnthropometricMeasurement:
               this.props.measure.addAnthropometricMeasurement(measurement);
               break;
            case MedicalAnalysisResult:
               this.props.measure.addMedicalAnalysisResult(measurement);
               break;
            case BodyCompositionMeasurement:
               this.props.measure.addBodyCompositionMeasurement(measurement);
               break;
            default:
               throw new Error("This measurement is not supported.");
         }
      });
      this.validate();
      this.addDomainEvent(
         new MeasurementAddedEvent({
            patientId: this.patientId,
            medicalRecordId: this.id,
            measurements,
         }),
      );
   }
   addFoodDiary(...foodDiares: FoodDiary[]) {
      for (const foodDiary of foodDiares) this.props.foodDiaries.push(foodDiary);
   }
   addObjective(...objectives: Objective[]) {
      for (const objective of objectives) {
         this.props.objectives.push(objective);
         this.addDomainEvent(new ObjectiveAddedEvent(objective));
      }
   }
   addEatingBehavior(...eatingBehaviors: EatingBehavior[]) {
      for (const eatingBehavior of eatingBehaviors) this.props.eatingBehaviors.push(eatingBehavior);
   }
   getMeasurement(
      measureTypeId: AggregateID,
      last: boolean = false,
   ):
      | IAnthropometricMeasurement[]
      | IAnthropometricMeasurement
      | IBodyCompositionMeasurement[]
      | IBodyCompositionMeasurement
      | IMedicalAnalysisResult[]
      | IMedicalAnalysisResult
      | undefined {
      const resultAnthro = this.props.measure.getAnthropometricMesurements(measureTypeId, last);
      if (resultAnthro != undefined) return resultAnthro;
      const resultMedical = this.props.measure.getMedicalAnalysisResults(measureTypeId, last);
      if (resultMedical != undefined) return resultMedical;
      const resultBodyComp = this.props.measure.getBodyCompositionMeasurements(measureTypeId, last);
      if (resultBodyComp != undefined) return resultBodyComp;
      return last ? undefined : [];
   }
   getFoodDiary(foodDiaryId: AggregateID): IFoodDiary & BaseEntityProps {
      return this.props.foodDiaries.find((foodDiary: FoodDiary) => foodDiary.id == foodDiaryId)?.getProps() as IFoodDiary & BaseEntityProps;
   }
   getMeasure(): IPatientMeasurements & BaseEntityProps {
      return this.props.measure.getProps();
   }
   getConsultationInformation(): IConsultationInformation & BaseEntityProps {
      return this.props.consultationInformation.getProps();
   }
   getFoodStory(): IFoodStory & BaseEntityProps {
      return this.props.foodStory.getProps();
   }
   getMedicalStory(): IMedicalStory & BaseEntityProps {
      return this.props.medicalStory.getProps();
   }
   getPersonalAndSocialStory(): IPersonalAndSocialStory & BaseEntityProps {
      return this.props.personalAndSocialStory.getProps();
   }
   getEatingBehavior(): IEatingBehavior[] {
      return this.props.eatingBehaviors.map((eatingBehavior: EatingBehavior) => eatingBehavior.unpack());
   }
   updateMeasure(patientMeasurements: PatientMeasurements) {
      if (patientMeasurements.equals(this.props.measure)) this.props.measure = patientMeasurements;
      this.validate();
      const patientMeasurementProps = patientMeasurements.getProps();
      this.addDomainEvent(
         new PatientMeasurementUpdatedEvent({
            patientId: this.patientId,
            medicalRecordId: this.id,
            measurements: [
               ...patientMeasurementProps.anthropometricMeasurements,
               ...patientMeasurementProps.bodyCompositionMeasurements,
               ...patientMeasurementProps.medicalAnalysisResults,
            ],
         }),
      );
   }
   updateConsultationInformation(consultationInfo: ConsultationInformation) {
      if (consultationInfo.equals(this.props.consultationInformation)) this.props.consultationInformation = consultationInfo;
   }
   updateFoodStory(foodStory: FoodStory): void {
      if (foodStory.equals(this.props.foodStory)) this.props.foodStory = foodStory;
   }
   updateMedicalStory(medicalStory: MedicalStory): void {
      if (medicalStory.equals(this.props.medicalStory)) this.props.medicalStory = medicalStory;
   }
   updatePersonalAndSocialStory(personalAndSocialStory: PersonalAndSocialStory) {
      if (personalAndSocialStory.equals(this.props.personalAndSocialStory)) this.props.personalAndSocialStory = personalAndSocialStory;
   }
   updateObjective(...objectives: Objective[]) {
      objectives.forEach((objective: Objective) => {
         const indexOfObjective = this.props.objectives.findIndex((obj: Objective) => obj.equals(objective));
         if (indexOfObjective !== -1) {
            this.props.objectives[indexOfObjective] = objective;
            this.addDomainEvent(new objectiveUpdatedEvent(objective));
         }
      });
   }

   updateFoodDiary(...foodDiaries: FoodDiary[]): void {
      foodDiaries.forEach((foodDiary: FoodDiary) => {
         const indexOfFoodDiary = this.props.foodDiaries.findIndex((foodD: FoodDiary) => foodD.equals(foodDiary));
         if (indexOfFoodDiary !== -1) this.props.foodDiaries[indexOfFoodDiary] = foodDiary;
      });
   }
   get objectives(): (BaseEntityProps & IObjective)[] {
      return this.props.objectives.map((objective: Objective) => objective.getProps());
   }
   get foodDiaries(): (BaseEntityProps & IFoodDiary)[] {
      return this.props.foodDiaries.map((foodDiary: FoodDiary) => foodDiary.getProps());
   }
   get anthropometricData(): IAnthropometricMeasurement[] {
      return this.props.measure.anthropometricMeasurements;
   }
   get bodyCompositionData(): IBodyCompositionMeasurement[] {
      return this.props.measure.bodyCompositionMeasurements;
   }
   get medicalAnalysisData(): IMedicalAnalysisResult[] {
      return this.props.measure.medicalAnalysisResults;
   }

   removeFoodDiary(foodDiaryId: AggregateID) {
      const index = this.props.foodDiaries.findIndex((fd) => fd.id === foodDiaryId);
      if (index !== -1) this.props.foodDiaries.splice(index, 1);
   }

   removeObjective(objectiveId: AggregateID) {
      const index = this.props.objectives.findIndex((obj) => obj.id === objectiveId);
      if (index !== -1) {
         this.props.objectives.splice(index, 1);
         this.addDomainEvent(new ObjectiveRemovedEvent(objectiveId));
      }
   }
   validate(): void {
      this._isValid = true;
   }
   static async create(patientId: AggregateID, createMedicalRecordProps?: CreateMedicalRecordProps): Promise<Result<MedicalRecord>> {
      try {
         const medicalStoryResult = MedicalStory.create(createMedicalRecordProps?.medicalStory);
         if (medicalStoryResult.isFailure) throw new ObjectCreationError(String(medicalStoryResult.err));
         const medicalStory = medicalStoryResult.val;
         const foodStoryResult = await FoodStory.create(createMedicalRecordProps?.foodStory);
         if (foodStoryResult.isFailure) throw new ObjectCreationError(String(foodStoryResult.err));
         const foodStory = foodStoryResult.val;
         const consultationInfoResult = ConsultationInformation.create(createMedicalRecordProps?.consultationInformation);
         if (consultationInfoResult.isFailure) throw new ObjectCreationError(String(consultationInfoResult.err));
         const consultationInformation = consultationInfoResult.val;
         const measure = new PatientMeasurements({
            props: {
               anthropometricMeasurements: [],
               bodyCompositionMeasurements: [],
               medicalAnalysisResults: [],
            },
         });
         const personalAndSocialStoryResult = PersonalAndSocialStory.create(createMedicalRecordProps?.personalAndSocialStory);
         if (personalAndSocialStoryResult.isFailure) throw new ObjectCreationError(String(personalAndSocialStoryResult.err));
         const personalAndSocialStory = personalAndSocialStoryResult.val;
         const medicalRecordProps = {
            foodDiaries: [] as FoodDiary[],
            objectives: [] as Objective[],
            eatingBehaviors: [] as EatingBehavior[],
            medicalStory,
            consultationInformation,
            measure,
            personalAndSocialStory,
            foodStory,
            patientId,
         };
         const medicalRecord = new MedicalRecord({
            props: medicalRecordProps,
         });
         return Result.ok<MedicalRecord>(medicalRecord);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<MedicalRecord>(`[${e.code}]:${e.message}`)
            : Result.fail<MedicalRecord>(`Erreur inattendue. ${MedicalRecord.constructor.name}`);
      }
   }
}
