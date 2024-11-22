import { CreateMeasurementTypeErrors } from "./CreateMeasurementTypeErrors";
import { CreateMeasurementTypeRequest } from "./CreateMeasurementTypeRequest";
import { CreateMeasurementTypeResponse } from "./CreateMeasurementTypeResponse";
import {  MeasurementType } from "./../../../../domain";
import { UseCase, AppError } from "./../../../../../../application";
import { Result, left, right } from "./../../../../../../core";
import { AggregateID } from "./../../../../../../domain";
import { MeasurementTypeRepository, MeasurementTypeRepositoryError } from "./../../../../infrastructure";
export class CreateMeasurementTypeUseCase implements UseCase<CreateMeasurementTypeRequest, CreateMeasurementTypeResponse> {
   constructor(private repo: MeasurementTypeRepository) {}

   async execute(request: CreateMeasurementTypeRequest): Promise<CreateMeasurementTypeResponse> {
      try {
         const measure = MeasurementType.create(request);
         if (measure.isFailure) return left(new CreateMeasurementTypeErrors.CreateMeasurementTypeFailed(measure.err));
         await this.repo.save(measure.val);
         return right(Result.ok<{ id: AggregateID; code: string }>({ id: measure.val.id, code: measure.val.code }));
      } catch (e) {
         if (e instanceof MeasurementTypeRepositoryError) return left(new CreateMeasurementTypeErrors.CreateMeasurementTypeError(e));
         return left(new AppError.UnexpectedError(e));
      }
   }
}
