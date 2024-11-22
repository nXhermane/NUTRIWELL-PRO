import {
   PatientMeasurements,
   IPatientMeasurements,
   IAnthropometricMeasurement,
   IBodyCompositionMeasurement,
   IMedicalAnalysisResult,
   AnthropometricMeasurement,
   BodyCompositionMeasurement,
   MedicalAnalysisResult,
} from "./../../domain";
import { Mapper, RegistrationDate } from "@shared";
import { PatientMeasurementPersistenceType } from "./../repositories/types";
import { PatientMeasurementDto } from "./../dtos/PatientMeasurementDto";
import { AnthropometricMeasurementDto } from "./../dtos/AnthropometricMeasurementDto";
import { BodyCompositionMeasurementDto } from "./../dtos/BodyCompositionMeasurementDto";
import { MedicalAnalysisResultDto } from "./../dtos/MedicalAnalysisResultDto";
export class PatientMeasurementMapper implements Mapper<PatientMeasurements, PatientMeasurementPersistenceType, PatientMeasurementDto> {
   toPersistence(entity: PatientMeasurements): PatientMeasurementPersistenceType {
      return {
         id: entity.id,
         anthropometricMeasurements: entity.anthropometricMeasurements.map((anth: IAnthropometricMeasurement) => ({
            date: anth.date.toString(),
            measureTypeId: anth.measureTypeId,
            value: anth.value,
            unit: anth.unit,
         })),

         bodyCompositionMeasurements: entity.bodyCompositionMeasurements.map((body: IBodyCompositionMeasurement) => ({
            date: body.date.toString(),
            measureTypeId: body.measureTypeId,
            value: body.value,
            unit: body.unit,
         })),

         medicalAnalysisResults: entity.medicalAnalysisResults.map((meAnRe: IMedicalAnalysisResult) => ({
            date: meAnRe.date.toString(),
            measureTypeId: meAnRe.measureTypeId,
            value: meAnRe.value,
            unit: meAnRe.unit,
         })),

         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: PatientMeasurementPersistenceType): PatientMeasurements {
      const anthropometricMeasurementsData = record.anthropometricMeasurements as (Omit<IAnthropometricMeasurement, "date"> & { date: string })[];
      const anthropometricMeasurements = anthropometricMeasurementsData.map(
         (anth: Omit<IAnthropometricMeasurement, "date"> & { date: string }) =>
            new AnthropometricMeasurement({
               date: new RegistrationDate(anth.date),
               measureTypeId: anth.measureTypeId,
               value: anth.value,
               unit: anth.unit,
            }),
      );
      const bodyCompositionMeasurementsData = record.bodyCompositionMeasurements as (Omit<IBodyCompositionMeasurement, "date"> & { date: string })[];
      const bodyCompositionMeasurements = bodyCompositionMeasurementsData.map(
         (body: Omit<IBodyCompositionMeasurement, "date"> & { date: string }) =>
            new BodyCompositionMeasurement({
               date: new RegistrationDate(body.date),
               measureTypeId: body.measureTypeId,
               value: body.value,
               unit: body.unit,
            }),
      );
      const medicalAnalysisResultsData = record.medicalAnalysisResults as (Omit<IMedicalAnalysisResult, "date"> & {
         date: string;
      })[];
      const medicalAnalysisResults = medicalAnalysisResultsData.map(
         (meReAn: Omit<IMedicalAnalysisResult, "date"> & { date: string }) =>
            new MedicalAnalysisResult({
               date: new RegistrationDate(meReAn.date),
               measureTypeId: meReAn.measureTypeId,
               value: meReAn.value,
               unit: meReAn.unit,
            }),
      );
      const { id, createdAt, updatedAt } = record;
      return new PatientMeasurements({
         id,
         createdAt,
         updatedAt,
         props: {
            anthropometricMeasurements,
            bodyCompositionMeasurements,
            medicalAnalysisResults,
         },
      });
   }
   toResponse(entity: PatientMeasurements): PatientMeasurementDto {
      return {
         anthropometricMeasurements: entity.anthropometricMeasurements.map((anthM: IAnthropometricMeasurement) => ({
            date: anthM.date.toString(),
            measureTypeId: anthM.measureTypeId,
            value: anthM.value,
            unit: anthM.unit,
         })) as AnthropometricMeasurementDto[],
         bodyCompositionMeasurements: entity.bodyCompositionMeasurements.map((bodyM: IBodyCompositionMeasurement) => ({
            date: bodyM.date.toString(),
            measureTypeId: bodyM.measureTypeId,
            value: bodyM.value,
            unit: bodyM.unit,
         })) as BodyCompositionMeasurementDto[],
         medicalAnalysisResults: entity.medicalAnalysisResults.map((meReM: IMedicalAnalysisResult) => ({
            date: meReM.date.toString(),
            measureTypeId: meReM.measureTypeId,
            value: meReM.value,
            unit: meReM.unit,
         })) as MedicalAnalysisResultDto[],
         id: entity.id,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
