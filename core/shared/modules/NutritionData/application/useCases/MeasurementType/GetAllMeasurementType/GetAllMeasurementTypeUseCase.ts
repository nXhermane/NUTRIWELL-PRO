import { GetAllMeasurementTypeErrors } from "./GetAllMeasurementTypeErrors";
import { GetAllMeasurementTypeRequest } from "./GetAllMeasurementTypeRequest";
import { GetAllMeasurementTypeResponse } from "./GetAllMeasurementTypeResponse";
import { UseCase, AppError } from "./../../../../../../application";
import { Result, left, right } from "./../../../../../../core";
import { IMeasurementType, MeasurementType } from "./../../../../domain";
import {
   MeasurementTypeDto,
   MeasurementTypeRepository,
   MeasurementTypeRepositoryError,
   MeasurementTypeRepositoryNotFoundException,
} from "./../../../../infrastructure";

export class GetAllMeasurementTypeUseCase implements UseCase<GetAllMeasurementTypeRequest, GetAllMeasurementTypeResponse> {
   constructor(private repo: MeasurementTypeRepository) {}

   async execute(request: GetAllMeasurementTypeRequest): Promise<GetAllMeasurementTypeResponse> {
      try {
         const measures = await this.repo.getAll(request?.measurementCategory);
         return right(
            Result.ok<MeasurementTypeDto[]>(
               measures.map((measure: MeasurementType) => ({
                  measurementCategory: measure.measureCategory as "Antropometry" | "MedicalAnalysis" | "BodyComposition",
                  measureTypeId: measure.id,
                  unit: measure.unit,
                  name: measure.name,
                  nameF: measure.nameF,
                  code: measure.code,
               })),
            ),
         );
      } catch (e) {
         if (e instanceof MeasurementTypeRepositoryNotFoundException) {
            return right(Result.ok<MeasurementTypeDto[]>([]));
         } else if (e instanceof MeasurementTypeRepositoryError) {
            return left(new GetAllMeasurementTypeErrors.MeasurementTypeRepositoryError(e));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }
}
