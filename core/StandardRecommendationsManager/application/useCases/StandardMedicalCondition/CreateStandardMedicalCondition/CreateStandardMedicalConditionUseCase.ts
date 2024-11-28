import {
   AggregateID,
   AppError,
   left,
   NeedsRecommendation,
   NeedsRecommendationDto,
   NeedsRecommendationFactory,
   Result,
   right,
   UseCase,
} from "@/core/shared";
import { CreateStandardMedicalConditionRequest } from "./CreateStandardMedicalConditionRequest";
import { CreateStandardMedicalConditionResponse } from "./CreateStandardMedicalConditionResponse";
import { CreateStandardMedicalConditionErrors } from "./CreateStandardMedicalConditionErrors";
import { StandardMedicalCondition } from "@/core/StandardRecommendationsManager/domain";
import { StandardMedicalConditionError, StandardMedicalConditionRepository } from "@/core/StandardRecommendationsManager/infrastructure";

export class CreateStandardMedicalConditionUseCase implements UseCase<CreateStandardMedicalConditionRequest, CreateStandardMedicalConditionResponse> {
   constructor(private repo: StandardMedicalConditionRepository) {}
   async execute(request: CreateStandardMedicalConditionRequest): Promise<CreateStandardMedicalConditionResponse> {
      try {
         const standardMedicalCondition = this.createStandardMedicalCondition(request);
         await this.repo.save(standardMedicalCondition);
         return right(
            Result.ok<{ id: AggregateID }>({
               id: standardMedicalCondition.id,
            }),
         );
      } catch (error) {
         if (error instanceof StandardMedicalConditionError)
            return left(new CreateStandardMedicalConditionErrors.CreateStandardMedicalConditionError(error));
         else if (
            error instanceof CreateStandardMedicalConditionErrors.CreateStandardMedicalConditionError ||
            error instanceof CreateStandardMedicalConditionErrors.CreateStandardMedicalConditionFailed
         )
            return left(error);
         else return left(new AppError.UnexpectedError(error));
      }
   }
   private createStandardMedicalCondition(request: CreateStandardMedicalConditionRequest): StandardMedicalCondition {
      const { recommendations, ...otherProps } = request;
      const createdRecommendations = this.createRecommendations(request.recommendations);
      const standardMedicalCondition = StandardMedicalCondition.create({
         ...otherProps,
         defaultRecommendation: createdRecommendations,
      });
      if (standardMedicalCondition.isFailure)
         throw new CreateStandardMedicalConditionErrors.CreateStandardMedicalConditionFailed(standardMedicalCondition.err);
      return standardMedicalCondition.val;
   }
   private createRecommendations(recommendations: NeedsRecommendationDto[]): NeedsRecommendation[] {
      const recommendationResults = recommendations.map((recommendation) => NeedsRecommendationFactory.create(recommendation));
      const recommendationCombineResult = Result.combine(recommendationResults);
      if (recommendationCombineResult.isFailure)
         throw new CreateStandardMedicalConditionErrors.CreateStandardMedicalConditionFailed(recommendationCombineResult.err);
      return recommendationResults.map((recommendationResult) => recommendationResult.val);
   }
}
