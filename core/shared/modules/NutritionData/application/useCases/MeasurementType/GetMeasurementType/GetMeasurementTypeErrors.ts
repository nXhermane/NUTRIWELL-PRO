import { Result } from "./../../../../../../core";
import { AggregateID } from "./../../../../../../domain";
import { UseCaseError } from "./../../../../../../application";
export namespace GetMeasurementTypeErrors {
   export class MeasurementTypeNotFoundError extends Result<UseCaseError> {
      constructor(err: any, idOrCode: AggregateID) {
         const message = `The MeasurementType with id or code:${idOrCode} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
