import { Result } from "./../../../../../../core";
import { AggregateID } from "./../../../../../../domain";
import { UseCaseError } from "./../../../../../../application";
export namespace GetAllMeasurementTypeErrors {
   export class MeasurementTypeRepositoryError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error in MeasurementType Repository. Please try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
