import { AggregateID, Result, UseCase } from "@/core/shared";
import { FoodDiaryDto } from "../../infrastructure";
import { IMedicalRecordDataProviderService } from "./interfaces/MedicalRecordDataProviderService";
import { GetAllFoodDiaryRequest, GetAllFoodDiaryResponse } from "../useCases";

export class MedicalRecordDataProvider implements IMedicalRecordDataProviderService {
   constructor(private getAllFoodDiaryUC: UseCase<GetAllFoodDiaryRequest, GetAllFoodDiaryResponse>) {}
   async getFoodDiaryByPatientId(patientId: AggregateID): Promise<Result<FoodDiaryDto[]>> {
      const foodDiaryDtos = await this.getAllFoodDiaryUC.execute({ patientId });
      if (foodDiaryDtos.isLeft()) return Result.fail<FoodDiaryDto[]>(foodDiaryDtos.value.err?.message);
      return Result.ok<FoodDiaryDto[]>(foodDiaryDtos.value.val);
   }
}
