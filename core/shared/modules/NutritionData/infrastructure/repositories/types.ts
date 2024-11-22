import { AggregateID } from "./../../../../domain";
export interface Timestamps {
   createdAt: string;
   updatedAt: string;
}
export interface MeasurementTypePersistenceType extends Timestamps {
   id: AggregateID;
   name: string;
   nameF: string;
   measureCategory: "Antropometry" | "MedicalAnalysis" | "BodyCompositiona";
   measureCode: string;
   unit: string;
}
