import {
   AggregateID,
   AggregateRoot,
   BaseEntityProps,
   Entity,
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
import { CurrentGoal, ICurrentGoal } from "../value-objects/CurrentGoal";
import { CreateMedicalConditionProps, CreatePatientProfilProps } from "../types";
import { PatientApi } from "@patientManager/application/api";
import { HealthMetrics, IHealthMetrics } from "../value-objects/HealthMetrics";
import { MeasurementAddedtoPatientProfilEvent } from "../events/MeasurementAddedToPatientProfil";
import { combinePath, invariablePath } from "../constants/VariablePathConstants";
import { MeasurementDeletedFromPatientProfilEvent } from "../events/MeasurementDeletedFromPatientProfilEvent";

export interface IPatientProfil {
   patientId: AggregateID;
   gender: Gender;
   age: Age;
   height: Height;
   weight: Weight;
   physicalActivityLevel: PhysicalActivityLevel;
   anthropomethricMeasure: { [measureCode: string]: HealthMetrics };
   bodyComposition: { [measureCode: string]: HealthMetrics };
   medicalAnalyses: { [measureCode: string]: HealthMetrics };
   medicalCondition: { [medicalConditionId: AggregateID]: MedicalCondition };
   currentGoal: CurrentGoal;
   otherInformations: { [infoName: string]: any };
}

export class PatientProfil extends AggregateRoot<IPatientProfil> {
   public validate(): void {
      this._isValid = true;
   }
   get patientId(): AggregateID {
      return this.props.patientId;
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

   get anthropomethricMeasure(): { [measureCode: string]: IHealthMetrics } {
      const anthropometricMeasure: { [measureCode: string]: IHealthMetrics } = {};
      for (const [key, measurement] of Object.entries(this.props.anthropomethricMeasure)) {
         anthropometricMeasure[key as string] = measurement.unpack();
      }
      return anthropometricMeasure;
   }
   get bodyCompositionMeasure(): { [measureCode: string]: IHealthMetrics } {
      return Object.fromEntries(Object.values(this.props.bodyComposition).map((measurement) => [measurement.unpack().code, measurement.unpack()]));
   }
   get medicalAnalysesMeasure(): { [measureCode: string]: IHealthMetrics } {
      return Object.fromEntries(Object.values(this.props.medicalAnalyses).map((measurement) => [measurement.unpack().code, measurement.unpack()]));
   }
   get medicalCondition(): { [medicalRecordId: AggregateID]: IMedicalCondition & BaseEntityProps } {
      return Object.fromEntries(Object.values(this.props.medicalCondition).map((value: MedicalCondition) => [value.id, value.getProps()]));
   }
   get medicalConditionNames(): string[] {
      return Object.values(this.props.medicalCondition).map((measurement) => measurement.name);
   }
   get currentGoal(): ICurrentGoal {
      return this.props.currentGoal.unpack();
   }
   set currentGoal(currentGoal: CurrentGoal) {
      this.props.currentGoal = currentGoal;
   }
   addAnthropometricMeasure(healthMetrics: HealthMetrics) {
      this.props.anthropomethricMeasure[healthMetrics.unpack().code] = healthMetrics;
      this.validate();
      this.addDomainEvent(
         new MeasurementAddedtoPatientProfilEvent({
            patientProfilId: this.id,
            measureName: healthMetrics.unpack().name,
            measurePath: combinePath(
               invariablePath.patientProfilPath,
               invariablePath.patientProfilAnthropometricMeasurePath(healthMetrics.unpack().code),
            ),
         }),
      );
   }
   addBodyCompositionMeasure(healthMetrics: HealthMetrics) {
      this.props.bodyComposition[healthMetrics.unpack().code] = healthMetrics;
      this.validate();
      this.addDomainEvent(
         new MeasurementAddedtoPatientProfilEvent({
            patientProfilId: this.id,
            measureName: healthMetrics.unpack().name,
            measurePath: combinePath(
               invariablePath.patientProfilPath,
               invariablePath.patientProfilBodyCompositionMeasurePath(healthMetrics.unpack().code),
            ),
         }),
      );
   }
   addMedicalAnalysesMeasure(healthMetrics: HealthMetrics) {
      this.props.medicalAnalyses[healthMetrics.unpack().code] = healthMetrics;
      this.validate();
      this.addDomainEvent(
         new MeasurementAddedtoPatientProfilEvent({
            patientProfilId: this.id,
            measureName: healthMetrics.unpack().name,
            measurePath: combinePath(
               invariablePath.patientProfilPath,
               invariablePath.patientProfilMedicalAnalysesMeasurePath(healthMetrics.unpack().code),
            ),
         }),
      );
   }
   getAnthropometricMeasure(measureCode: string): IHealthMetrics {
      return this.props.anthropomethricMeasure[measureCode]?.unpack();
   }
   getBodyCompositionMeasure(measureCode: string): IHealthMetrics {
      return this.props.bodyComposition[measureCode]?.unpack();
   }
   getMedicalAnalysesMeasure(measureCode: string): IHealthMetrics {
      return this.props.medicalAnalyses[measureCode]?.unpack();
   }
   getAnthropometricMeasureValue(measureCode: string): number | undefined {
      return this.props.anthropomethricMeasure[measureCode]?.unpack().value;
   }
   getBodyCompositionMeasureValue(measureCode: string): number | undefined {
      return this.props.bodyComposition[measureCode]?.unpack().value;
   }
   getMedicalAnalysesMeasureValue(measureCode: string): number | undefined {
      return this.props.medicalAnalyses[measureCode]?.unpack().value;
   }

   addMedicalCondition(...medicalConditions: MedicalCondition[]) {
      medicalConditions.forEach((value: MedicalCondition) => {
         this.props.medicalCondition[value.id] = value;
      });
   }
   addOrdersInformationsToMedicalCondition(
      mediacalConditionId: AggregateID,
      otherInformationObject: { informationName: string; informationValue: any },
   ) {
      const medicalCondition = this.props.medicalCondition[mediacalConditionId];
      if (medicalCondition) {
         medicalCondition.addOrdersInformations(otherInformationObject.informationName, otherInformationObject.informationValue);
      } else {
         throw new InvalidReference(`Medical condition with id ${mediacalConditionId} not found`);
      }
      this.validate();
      this.addDomainEvent(
         new MeasurementAddedtoPatientProfilEvent({
            patientProfilId: this.id,
            measureName: otherInformationObject.informationName,
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
            measureName: informationName,
            measurePath: combinePath(invariablePath.patientProfilPath, invariablePath.patientProfilOtherInformationsPath(informationName)),
         }),
      );
   }

   updateMedicalConditionName(medicalConditionId: AggregateID, name: string) {
      const mediacalCondition = this.props.medicalCondition[medicalConditionId];
      if (mediacalCondition) {
         mediacalCondition.name = name;
      } else {
         throw new InvalidReference(`Medical condition with id ${medicalConditionId} not found`);
      }
      this.validate();
   }
   updateMedicalConditionSeverity(medicalConditionId: AggregateID, severity: "light" | "moderate" | "severe") {
      const mediacalCondition = this.props.medicalCondition[medicalConditionId];
      if (mediacalCondition) {
         mediacalCondition.severity = severity;
      } else {
         throw new InvalidReference(`Medical condition with id ${medicalConditionId} not found`);
      }
      this.validate();
   }

   addRecommendationToMedicalCondition(medicalConditionId: AggregateID, recommendations: NeedsRecommendation[]) {
      const mediacalCondition = this.props.medicalCondition[medicalConditionId];
      if (mediacalCondition) {
         mediacalCondition.addRecommandation(...recommendations);
      } else {
         throw new InvalidReference(`Medical condition with id ${medicalConditionId} not found`);
      }
      this.validate();
   }

   removeMedicalCondition(medicalconditionId: AggregateID) {
      if (this.props.medicalCondition[medicalconditionId]) {
         delete this.props.medicalCondition[medicalconditionId];
      }
   }
   removeAnthropometricMeasure(measureCode: string) {
      if (this.props.anthropomethricMeasure[measureCode]) {
         const measure = this.props.anthropomethricMeasure[measureCode];
         delete this.props.anthropomethricMeasure[measureCode];
         this.validate();
         this.addDomainEvent(
            new MeasurementDeletedFromPatientProfilEvent({
               patientProfilId: this.id,
               measureName: measure.unpack().name,
            }),
         );
      }
   }
   removeBodyCompositionMeasure(measureCode: string) {
      if (this.props.bodyComposition[measureCode]) {
         const measure = this.props.bodyComposition[measureCode];
         delete this.props.bodyComposition[measureCode];
         this.validate();
         this.addDomainEvent(
            new MeasurementDeletedFromPatientProfilEvent({
               patientProfilId: this.id,
               measureName: measure.unpack().name,
            }),
         );
      }
   }
   removeMedicalAnalysesMeasure(measureCode: string) {
      if (this.props.medicalAnalyses[measureCode]) {
         const measure = this.props.medicalAnalyses[measureCode];
         delete this.props.medicalAnalyses[measureCode];
         this.addDomainEvent(
            new MeasurementDeletedFromPatientProfilEvent({
               patientProfilId: this.id,
               measureName: measure.unpack().name,
            }),
         );
      }
   }
   removeOtherInformationOnPatientProfil(informationName: string) {
      if (this.props.otherInformations[informationName]) {
         delete this.props.otherInformations[informationName];
         this.validate();
         this.addDomainEvent(
            new MeasurementDeletedFromPatientProfilEvent({
               patientProfilId: this.id,
               measureName: informationName,
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
         const currentGoalResult = CurrentGoal.create(createPatientProfilProps?.currrentGoal || { goalId: "", goalRules: [] }); // TODO : cette partir est a revoir a cause du default Goal
         const medicalConditionResult = createPatientProfilProps.medicalCondition?.map((medicalCondition: CreateMedicalConditionProps) =>
            MedicalCondition.create(medicalCondition),
         );
         const validateResult = Result.combine([ageResult, genderResult, heightResult, weightResult, currentGoalResult, ...medicalConditionResult]);
         if (validateResult.isFailure) return Result.fail<PatientProfil>(`[Erreur]: ${(validateResult.err as any)?.toJSON() || validateResult.err}`);

         const patientProfil = new PatientProfil({
            props: {
               patientId,
               physicalActivityLevel,
               age: ageResult.val,
               gender: genderResult.val,
               height: heightResult.val,
               weight: weightResult.val,
               currentGoal: currentGoalResult.val,
               medicalCondition: Object.fromEntries(
                  medicalConditionResult.map((medicalCondResult: Result<MedicalCondition>) => [medicalCondResult.val.id, medicalCondResult.val]),
               ),
               anthropomethricMeasure: createPatientProfilProps.anthropomethricMeasure,
               bodyComposition: createPatientProfilProps.bodyComposition,
               medicalAnalyses: createPatientProfilProps.medicalAnalyses,
               otherInformations: createPatientProfilProps.otherInformations,
            },
         });
         return Result.ok<PatientProfil>(patientProfil);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<PatientProfil>(`[${error.code}]:${error.message}`)
            : Result.fail<PatientProfil>(`Erreur inattendue. ${PatientProfil?.constructor.name}`);
      }
   }
}
