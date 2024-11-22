import { AggregateID } from "./../../../../domain";
export interface MeasurementTypeDto {
   measurementCategory: "Antropometry" | "MedicalAnalysis" | "BodyComposition";
   measureTypeId: AggregateID;
   unit: string;
   name: string;
   nameF: string;
   code: string;
}
