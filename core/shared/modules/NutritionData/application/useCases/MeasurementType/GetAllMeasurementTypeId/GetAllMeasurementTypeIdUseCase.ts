import { GetAllMeasurementTypeIdErrors } from "./GetAllMeasurementTypeIdErrors";
import { GetAllMeasurementTypeIdRequest } from "./GetAllMeasurementTypeIdRequest";
import { GetAllMeasurementTypeIdResponse } from "./GetAllMeasurementTypeIdResponse";
import { UseCase, AppError } from "./../../../../../../application";
import { Result, left, right } from "./../../../../../../core";
import { AggregateID } from "./../../../../../../domain";
import { IMeasurementType, MeasurementType } from "./../../../../domain";
import { MeasurementTypeRepository, MeasurementTypeRepositoryError, MeasurementTypeRepositoryNotFoundException } from "./../../../../infrastructure";

export class GetAllMeasurementTypeIdUseCase implements UseCase<GetAllMeasurementTypeIdRequest, GetAllMeasurementTypeIdResponse> {
   constructor(private repo: MeasurementTypeRepository) {}

   async execute(request: GetAllMeasurementTypeIdRequest): Promise<GetAllMeasurementTypeIdResponse> {
      try {
         const measures = await this.repo.getAllId(request?.measurementCategory);
         return right(Result.ok<{ id: AggregateID; code: string }[]>(measures));
      } catch (e) {
         if (e instanceof MeasurementTypeRepositoryNotFoundException) {
            return right(Result.ok<{ id: AggregateID; code: string }[]>([]));
         } else if (e instanceof MeasurementTypeRepositoryError) {
            return left(new GetAllMeasurementTypeIdErrors.MeasurementTypeRepositoryError(e));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }
}
