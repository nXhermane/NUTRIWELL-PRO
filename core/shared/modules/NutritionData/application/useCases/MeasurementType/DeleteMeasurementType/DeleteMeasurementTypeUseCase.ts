import { DeleteMeasurementTypeRequest } from "./DeleteMeasurementTypeRequest";
import { DeleteMeasurementTypeResponse } from "./DeleteMeasurementTypeResponse";
import { UseCase, AppError } from "./../../../../../../application";
import { Result, left, right } from "./../../../../../../core";

import { MeasurementTypeRepository, MeasurementTypeRepositoryError } from "./../../../../infrastructure";

export class DeleteMeasurementTypeUseCase implements UseCase<DeleteMeasurementTypeRequest, DeleteMeasurementTypeResponse> {
   constructor(private repo: MeasurementTypeRepository) {}

   async execute(request: DeleteMeasurementTypeRequest): Promise<DeleteMeasurementTypeResponse> {
      try {
         await this.repo.delete(request.id);
         return right(Result.ok<boolean>(true));
      } catch (e) {
         if (e instanceof MeasurementTypeRepositoryError) {
            return right(Result.ok<boolean>(false));
         } else {
            return left(new AppError.UnexpectedError(e));
         }
      }
   }
}
