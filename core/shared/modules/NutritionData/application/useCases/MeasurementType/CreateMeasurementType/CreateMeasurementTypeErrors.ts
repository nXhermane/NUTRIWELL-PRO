import { Result } from "./../../../../../../core";
import { UseCaseError} from "./../../../../../../application"

export namespace CreateMeasurementTypeErrors {
   export class CreateMeasurementTypeFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Error on the creation of the measurement type with the factory. Be sure to check the data supply.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class CreateMeasurementTypeError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Measurement Repository Error. Try this operation after a few moment.`;
         super(false, { message } as UseCaseError);
      }
   }
}
