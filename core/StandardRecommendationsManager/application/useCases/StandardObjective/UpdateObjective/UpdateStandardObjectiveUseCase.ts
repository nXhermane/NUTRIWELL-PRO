import { AggregateID, AppError, left, Result, right, Timeframe, UseCase } from "@/core/shared";
import { UpdateStandardObjectiveDto, UpdateStandardObjectiveRequest } from "./UpdateStandardObjectiveRequest";
import { UpdateStandardObjectiveResponse } from "./UpdateStandardObjectiveResponse";
import { StandardObjectiveRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { UpdateStandardObjectiveErrors } from "./UpdateStandardObjectiveErrors";
import { StandardObjective } from "@/core/StandardRecommendationsManager/domain";

export class UpdateStandardObjectiveUseCase implements UseCase<UpdateStandardObjectiveRequest, UpdateStandardObjectiveResponse> {
   constructor(private repo: StandardObjectiveRepository) {}
   async execute(request: UpdateStandardObjectiveRequest): Promise<UpdateStandardObjectiveResponse> {
      try {
         const objective = await this.getStandardObjective(request.standardObjectiveId);
         this.updateStandardObjective(objective, request.data);
         await this.saveStandardObjective(objective);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof UpdateStandardObjectiveErrors.StandardObjectiveValidationError) return left(error);
         else if (error instanceof UpdateStandardObjectiveErrors.StandardObjectiveNotFoundError) return left(error);
         else if (error instanceof UpdateStandardObjectiveErrors.StandardObjectiveRepoError) return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }
   private updateStandardObjective(objective: StandardObjective, data: UpdateStandardObjectiveDto): void {
      try {
         if (data.name) objective.name = data.name;
         if (data.type) objective.type = data.type;
         if (data.targetValue) objective.targetValue = data.targetValue;
         if (data.initialValue) objective.initialValue = data.initialValue;
         if (data.description) objective.description = data.description;
         if (data.measureCode) objective.measureCode = data.measureCode;
         if (data.timeframe) objective.timeframe = Timeframe.create(data.timeframe).val;
         if (data.unit) objective.unit = data.unit;
      } catch (e: any) {
         throw new UpdateStandardObjectiveErrors.StandardObjectiveValidationError(e);
      }
   }
   private async getStandardObjective(objectiveId: AggregateID): Promise<StandardObjective> {
      try {
         const objective = await this.repo.getById(objectiveId);
         return objective;
      } catch (error) {
         throw new UpdateStandardObjectiveErrors.StandardObjectiveNotFoundError(error, objectiveId);
      }
   }
   private async saveStandardObjective(objective: StandardObjective) {
      try {
         await this.repo.save(objective);
      } catch (err: any) {
         throw new UpdateStandardObjectiveErrors.StandardObjectiveRepoError(err);
      }
   }
}
