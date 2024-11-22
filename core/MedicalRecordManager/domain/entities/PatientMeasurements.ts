import { Entity, CreateEntityProps, Guard, ArgumentInvalidException, ArgumentOutOfRangeException, AggregateID } from "@shared";

import { AnthropometricMeasurement, IAnthropometricMeasurement } from "./../value-objects/AnthropometricMeasurement";
import { BodyCompositionMeasurement, IBodyCompositionMeasurement } from "./../value-objects/BodyCompositionMeasurement";
import { MedicalAnalysisResult, IMedicalAnalysisResult } from "./../value-objects/MedicalAnalysisResult";
export interface IPatientMeasurements {
   anthropometricMeasurements: AnthropometricMeasurement[];
   bodyCompositionMeasurements: BodyCompositionMeasurement[];
   medicalAnalysisResults: MedicalAnalysisResult[];
}

export class PatientMeasurements extends Entity<IPatientMeasurements> {
   constructor(createPatientMeasurementsProps: CreateEntityProps<IPatientMeasurements>) {
      super(createPatientMeasurementsProps);
   }
   addAnthropometricMeasurement(measurement: AnthropometricMeasurement) {
      this.props.anthropometricMeasurements.push(measurement);
   }

   addBodyCompositionMeasurement(measurement: BodyCompositionMeasurement) {
      this.props.bodyCompositionMeasurements.push(measurement);
   }

   addMedicalAnalysisResult(result: MedicalAnalysisResult) {
      this.props.medicalAnalysisResults.push(result);
   }
   get anthropometricMeasurements(): IAnthropometricMeasurement[] {
      return this.props.anthropometricMeasurements.map((anthM: AnthropometricMeasurement) => anthM.unpack());
   }
   get bodyCompositionMeasurements(): IBodyCompositionMeasurement[] {
      return this.props.bodyCompositionMeasurements.map((bodyCompM: BodyCompositionMeasurement) => bodyCompM.unpack());
   }
   get medicalAnalysisResults(): IMedicalAnalysisResult[] {
      return this.props.medicalAnalysisResults.map((medicAnalR: MedicalAnalysisResult) => medicAnalR.unpack());
   }

   getAnthropometricMesurements(measureType: AggregateID, last: boolean = false): IAnthropometricMeasurement[] | IAnthropometricMeasurement {
      const measures = this.props.anthropometricMeasurements.reduce(
         (filteredMeasures: IAnthropometricMeasurement[], anthM: AnthropometricMeasurement) => {
            if (measureType === anthM.measureTypeId) {
               filteredMeasures.push(anthM.unpack());
            }
            return filteredMeasures;
         },
         [],
      );
      return last ? (this.getLastMeasure(measures) as IAnthropometricMeasurement) : measures;
   }

   getBodyCompositionMeasurements(measureType: AggregateID, last: boolean = false): IBodyCompositionMeasurement[] | IBodyCompositionMeasurement {
      const measures = this.props.bodyCompositionMeasurements.reduce(
         (filteredMeasures: IBodyCompositionMeasurement[], bodyCompM: BodyCompositionMeasurement) => {
            if (measureType === bodyCompM.measureTypeId) {
               filteredMeasures.push(bodyCompM.unpack());
            }
            return filteredMeasures;
         },
         [],
      );
      return last ? (this.getLastMeasure(measures) as IBodyCompositionMeasurement) : measures;
   }

   getMedicalAnalysisResults(measureType: AggregateID, last: boolean = false): IMedicalAnalysisResult[] | IMedicalAnalysisResult {
      const measures = this.props.medicalAnalysisResults.reduce((filteredMeasures: IMedicalAnalysisResult[], medicAnalR: MedicalAnalysisResult) => {
         if (measureType === medicAnalR.measureTypeId) {
            filteredMeasures.push(medicAnalR.unpack());
         }
         return filteredMeasures;
      }, []);
      return last ? (this.getLastMeasure(measures) as IMedicalAnalysisResult) : measures;
   }

   private getLastMeasure(
      measures: IMedicalAnalysisResult[] | IBodyCompositionMeasurement[] | IAnthropometricMeasurement[],
   ): IMedicalAnalysisResult | IBodyCompositionMeasurement | IAnthropometricMeasurement {
      let lastMeasure: IMedicalAnalysisResult | IBodyCompositionMeasurement | IAnthropometricMeasurement = measures[0];
      for (let i = 1; i < measures.length; i++) {
         const currentMeasure = measures[i];
         if (currentMeasure.date.isAfter(lastMeasure.date)) {
            lastMeasure = currentMeasure;
         }
      }
      return lastMeasure;
   }
   validate(): void {
      this._isValid = true;
   }
}
