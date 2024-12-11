import { Result } from "@/core/shared";
import { CreatePatientNeedsModel } from "../entities/types";
import { PatientNeedsModel } from "../entities/PatientNeedsModel";

export interface IPatientNeedsModelFactory {
   create(createPatientNeedsModelProps: CreatePatientNeedsModel): Promise<Result<PatientNeedsModel>>;
}
