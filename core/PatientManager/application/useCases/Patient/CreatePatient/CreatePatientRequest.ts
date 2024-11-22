import { CreatePatientProps } from "./../../../../domain";
export type CreatePatientRequest = Omit<CreatePatientProps, "medicalRecordId">;
