import { IMeasurementType } from "./../../../../domain";
export type CreateMeasurementTypeRequest = Omit<IMeasurementType, ""> & { measureCategory: "Antropometry" | "MedicalAnalysis" | "BodyComposition" };
