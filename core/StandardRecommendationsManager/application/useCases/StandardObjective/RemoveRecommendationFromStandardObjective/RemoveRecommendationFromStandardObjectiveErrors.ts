import { AggregateID, Result, UseCaseError } from "@/core/shared";

export namespace RemoveRecommendationFromStandardObjectiveErrors {
   export class RecommendationNotFoundOnStandardObjective extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `The recommendation not found on the Standard Objective. [Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class StandardObjectiveNotFoundError extends Result<UseCaseError> {
      constructor(err: any, id: AggregateID) {
         const message = `The Standard Objective with id:${id} is not found.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class StandardObjectiveRepoError extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `Standard Objective Repository Error. Try this operation after a few moment.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
   export class NeedsRecommendationCreationFailed extends Result<UseCaseError> {
      constructor(err: any) {
         const message = `The NeedsRecommendation creation Failed. Try to verify the props.[Error]:${err?.toJSON() || err}`;
         super(false, { message } as UseCaseError);
      }
   }
}
