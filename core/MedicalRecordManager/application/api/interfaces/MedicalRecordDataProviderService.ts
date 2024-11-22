import { FoodDiaryDto } from "../../../infrastructure";
import { AggregateID, Result } from "@/core/shared";

export interface IMedicalRecordDataProviderService {
   getFoodDiaryByPatientId(patientId: AggregateID): Promise<Result<FoodDiaryDto[]>>;
}
