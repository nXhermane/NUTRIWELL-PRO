import { AggregateID } from "@shared";
import { CreateMedicalRecordProps } from "./../../../../domain";
export type CreateMedicalRecordRequest = { data: CreateMedicalRecordProps; patientId: AggregateID };
