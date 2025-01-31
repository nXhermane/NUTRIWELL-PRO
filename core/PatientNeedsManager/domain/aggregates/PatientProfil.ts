import {
   AggregateID,
   AggregateRoot,
   BaseEntityProps,
   ExceptionBase,
   Gender,
   Guard,
   InvalidReference,
   NeedsRecommendation,
   PhysicalActivityLevel,
   Result,
} from "@shared";
import { Age } from "../value-objects/Age";
import { Height } from "../value-objects/Height";
import { Weight } from "../value-objects/Weight";
import { IMedicalCondition, MedicalCondition } from "./../entities/MedicalCondition";
import { CreateMedicalConditionProps, CreatePatientProfilProps } from "../types";
import { PatientApi } from "@patientManager/application/api";
import { HealthMetric, IHealthMetric} from "../value-objects/HealthMetric";
import { MeasurementAddedtoPatientProfilEvent } from "../events/MeasurementAddedToPatientProfil";
import { combinePath, invariablePath } from "../constants/VariablePathConstants";
import { MeasurementDeletedFromPatientProfilEvent } from "../events/MeasurementDeletedFromPatientProfilEvent";
import { IObjective, Objective } from "../entities/Objective";
import { PatientProfilCreatedEvent } from "../events/PatientProfilCreatedEvent";

export interface IPatientProfil {
   patientId: AggregateID;
   gender: Gender;
   age: Age;
   height: Height;
   weight: Weight;
   physicalActivityLevel: PhysicalActivityLevel; // TODO: I can implement a value object for this later
   healthMetrics: {[measureCode:string]: HealthMetric}
   medicalConditions: { [medicalConditionId: AggregateID]: MedicalCondition };
   objectives: {[objectiveId: AggregateID]: Objective}
   patientNeedsModelId: AggregateID;
   otherInformations: { [infoName: string]: any };
}

export class PatientProfil extends AggregateRoot<IPatientProfil> {
   public validate(): void {
      // TODO: I can implement validation laters here...
      if (Guard.isEmpty(this.props.patientId).succeeded)
         throw new InvalidReference("La reference vers le patient ne doit être vide dans le PatientProfil.");
      if (Guard.isEmpty(this.props.patientNeedsModelId).succeeded)
         throw new InvalidReference("La reference vers le model de besoins du patient ne doit être vide.");
      this._isValid = true;
   }
   get patientId(): AggregateID {
      return this.props.patientId;
   }
   get patientNeedsModelId(): AggregateID {
      return this.props.patientNeedsModelId;
   }
   set patientNeedsModelId(value: AggregateID) {
      this.props.patientNeedsModelId = value;
      this.validate();
   }

   get gender(): "M" | "F" | "O" {
      return this.props.gender.sexe;
   }
   set gender(gender: Gender) {
      this.props.gender = gender;
   }
   get age(): number {
      return this.props.age.getValue();
   }
   set age(age: Age) {
      this.props.age = age;
   }
   get ageYears(): number {
      return this.props.age.age_y;
   }
   get ageMonths(): number {
      return this.props.age.age_m;
   }
   get height(): number {
      return this.props.height.getValue();
   }
   get heightInFeet(): number {
      return this.props.height.toFeet();
   }
   get heightInMeters(): number {
      return this.props.height.toMeters();
   }
   get heightInInches(): number {
      return this.props.height.toInches();
   }
   set height(height: Height) {
      this.props.height = height;
   }
   get weight(): number {
      return this.props.weight.getValue();
   }
   get weightInPounds(): number {
      return this.props.weight.toPounds();
   }
   set weight(weight: Weight) {
      this.props.weight = weight;
   }
   get physicalActivityLevel(): "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active" {
      return this.props.physicalActivityLevel;
   }
   set physicalActivityLevel(physicalActivityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extremely Active") {
      this.props.physicalActivityLevel = physicalActivityLevel as PhysicalActivityLevel;
   }

   get healthMetrics(): {[measureCode: string]: IHealthMetric} {
      return Object.fromEntries(Object.values(this.props.healthMetrics).map(healthMetric=> ([healthMetric.unpack().code,healthMetric.unpack()])))
   }
   get medicalCondition(): { [medicalRecordId: AggregateID]: IMedicalCondition & BaseEntityProps } {
      return Object.fromEntries(Object.values(this.props.medicalConditions).map((value: MedicalCondition) => [value.id, value.getProps()]));
   }

   get medicalConditionNames(): string[] {
      return Object.values(this.props.medicalConditions).map((measurement) => measurement.name);
   }
   get objective(): { [objectiveId: AggregateID]: IObjective & BaseEntityProps } {
      return Object.fromEntries(Object.values(this.props.objectives).map((value: Objective) => [value.id, value.getProps()]));
   }
   get otherInformations(): Record<string, any> {
      return this.props.otherInformations;
   }

   getObjectives(): Objective[] {
      return Object.values(this.props.objectives);
   }
   getMedicalConditions(): MedicalCondition[] {
      return Object.values(this.props.medicalConditions);
   }
   addHeathMetric(healthMetric: HealthMetric) {
      const measureCode = healthMetric.unpack().code.toString()
      this.props.healthMetrics[measureCode] = healthMetric
      this.validate()
      this.addDomainEvent(new MeasurementAddedtoPatientProfilEvent({
         patientProfilId: this.id,
         measureCode,
         measurePath: combinePath(invariablePath.patientProfilPath,invariablePath.patientProfilHealthMetricsPath(measureCode))
      }))
   }
   getHealthMetric(measureCode: string) : IHealthMetric {
      return this.props.healthMetrics[measureCode]?.unpack()
   }
   addMedicalCondition(...medicalConditions: MedicalCondition[]) {
      medicalConditions.forEach((value: MedicalCondition) => {
         this.props.medicalConditions[value.id] = value;
      });
   }
   addOtherInformationsToMedicalCondition(
      mediacalConditionId: AggregateID,
      otherInformationObject: { informationName: string; informationValue: any },
   ) {
      const medicalCondition = this.props.medicalConditions[mediacalConditionId];
      if (medicalCondition) {
         medicalCondition.addOtherInformations(otherInformationObject.informationName, otherInformationObject.informationValue);
      } else {
         throw new InvalidReference(`Medical condition with id ${mediacalConditionId} not found`);
      }
      this.validate();
      this.addDomainEvent(
         new MeasurementAddedtoPatientProfilEvent({
            patientProfilId: this.id,
            measureCode: otherInformationObject.informationName,
            measurePath: combinePath(
               invariablePath.patientProfilPath,
               invariablePath.medicalConditonPath(mediacalConditionId),
               invariablePath.medicalConditionOtherInformationsPath(otherInformationObject.informationName),
            ),
         }),
      );
   }
   addOtherInformations(informationName: string, informationValue: any) {
      this.props.otherInformations[informationName] = informationValue;
      this.validate();
      this.addDomainEvent(
         new MeasurementAddedtoPatientProfilEvent({
            patientProfilId: this.id,
            measureCode: informationName,
            measurePath: combinePath(invariablePath.patientProfilPath, invariablePath.patientProfilOtherInformationsPath(informationName)),
         }),
      );
   }

   updateMedicalConditionName(medicalConditionId: AggregateID, name: string) {
      const mediacalCondition = this.props.medicalConditions[medicalConditionId];
      if (mediacalCondition) {
         mediacalCondition.name = name;
      } else {
         throw new InvalidReference(`Medical condition with id ${medicalConditionId} not found`);
      }
      this.validate();
   }
   updateMedicalConditionSeverity(medicalConditionId: AggregateID, severity: "light" | "moderate" | "severe") {
      const mediacalCondition = this.props.medicalConditions[medicalConditionId];
      if (mediacalCondition) {
         mediacalCondition.severity = severity;
      } else {
         throw new InvalidReference(`Medical condition with id ${medicalConditionId} not found`);
      }
      this.validate();
   }

   addRecommendationToMedicalCondition(medicalConditionId: AggregateID, recommendations: NeedsRecommendation[]) {
      const mediacalCondition = this.props.medicalConditions[medicalConditionId];
      if (mediacalCondition) {
         mediacalCondition.addRecommandation(...recommendations);
      } else {
         throw new InvalidReference(`Medical condition with id ${medicalConditionId} not found`);
      }
      this.validate();
   }

   removeMedicalCondition(medicalconditionId: AggregateID) {
      if (this.props.medicalConditions[medicalconditionId]) {
         delete this.props.medicalConditions[medicalconditionId];
      }
   }
   removeHealthMetric(measureCode: string) {
      if(this.props.healthMetrics[measureCode]) {
         const measure = this.props.healthMetrics[measureCode]
        delete this.props.healthMetrics[measureCode]
        this.validate()
        this.addDomainEvent(new MeasurementDeletedFromPatientProfilEvent({
         patientProfilId: this.id,
         measureCode: measureCode
        }))
      }
   }
  
   removeOtherInformationOnPatientProfil(informationName: string) {
      if (this.props.otherInformations[informationName]) {
         delete this.props.otherInformations[informationName];
         this.validate();
         this.addDomainEvent(
            new MeasurementDeletedFromPatientProfilEvent({
               patientProfilId: this.id,
               measureCode: informationName,
            }),
         );
      }
   }
   static async create(createPatientProfilProps: CreatePatientProfilProps): Promise<Result<PatientProfil>> {
      try {
         const patientId = createPatientProfilProps.patientId;
         const patientResult = await (await PatientApi.getInstance()).getPatientInfoById(createPatientProfilProps.patientId);
         if (patientResult.isFailure) return Result.fail<PatientProfil>(`[Erreur]: ${(patientResult.err as any)?.toJSON() || patientResult.err}`);
         const physicalActivityLevel = createPatientProfilProps.physicalActivityLevel as PhysicalActivityLevel;
         const ageResult = Age.create(createPatientProfilProps.age);
         const genderResult = Gender.create(createPatientProfilProps.gender);
         const heightResult = Height.create(createPatientProfilProps.height);
         const weightResult = Weight.create(createPatientProfilProps.weight);
         const objectiveResult = createPatientProfilProps.objective.map((objectiveProps) => Objective.create(objectiveProps));
         const medicalConditionResult = createPatientProfilProps.medicalCondition?.map((medicalCondition: CreateMedicalConditionProps) =>
            MedicalCondition.create(medicalCondition),
         );
         const healthMetricsResult = createPatientProfilProps.healthMetrics.map(healthMetricProps => HealthMetric.create(healthMetricProps))
         const validateResult = Result.combine([ageResult, genderResult, heightResult, weightResult, ...objectiveResult, ...medicalConditionResult,...healthMetricsResult]);
         if (validateResult.isFailure) return Result.fail<PatientProfil>(`[Erreur]: ${(validateResult.err as any)?.toJSON() || validateResult.err}`);

         const patientProfil = new PatientProfil({
            props: {
               patientId,
               patientNeedsModelId: createPatientProfilProps.patientNeedsModelId,
               physicalActivityLevel,
               age: ageResult.val,
               gender: genderResult.val,
               height: heightResult.val,
               weight: weightResult.val,
               objectives: Object.fromEntries(objectiveResult.map((objectiveRes) => [objectiveRes.val.id, objectiveRes.val])),
               medicalConditions: Object.fromEntries(
                  medicalConditionResult.map((medicalCondResult: Result<MedicalCondition>) => [medicalCondResult.val.id, medicalCondResult.val]),
               ),
               healthMetrics:Object.fromEntries(healthMetricsResult.map(healthMetricResult=> ([healthMetricResult.val.unpack().code.toString(),healthMetricResult.val]))),
               otherInformations: createPatientProfilProps.otherInformations,
            },
         });
         patientProfil.addDomainEvent(
            new PatientProfilCreatedEvent({
               patientProfil: patientProfil,
            }),
         );
         return Result.ok<PatientProfil>(patientProfil);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<PatientProfil>(`[${error.code}]:${error.message}`)
            : Result.fail<PatientProfil>(`Erreur inattendue. ${PatientProfil?.constructor.name}`);
      }
   }
}
