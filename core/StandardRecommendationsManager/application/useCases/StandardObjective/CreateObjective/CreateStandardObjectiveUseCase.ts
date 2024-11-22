import { AggregateID, AppError, left, NeedsRecommendationFactory, Result, right, UseCase } from "@/core/shared";
import { CreateStandardObjectiveRequest } from "./CreateStandardObjectiveRequest";
import { CreateStandardObjectiveResponse } from "./CreateStandardObjectiveResponse";
import { StandardObjectiveError, StandardObjectiveRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { CreateStandardObjectiveErrors } from "./CreateStandardObjectiveErrors";
import { StandardObjective } from "../../../../domain";

export class CreateStandardObjectiveUseCase implements UseCase<CreateStandardObjectiveRequest, CreateStandardObjectiveResponse> {
    constructor(private repository: StandardObjectiveRepository) {

    }
    async execute(request: CreateStandardObjectiveRequest): Promise<CreateStandardObjectiveResponse> {
        try {
            const defaultRecommendationResult = request.recommendations.map(recommendation => NeedsRecommendationFactory.create(recommendation))
            const recommendationCombineResult = Result.combine(defaultRecommendationResult as Result<any>[])
            if (recommendationCombineResult.isFailure) return left(new CreateStandardObjectiveErrors.CreateStandardObjectiveFailed(recommendationCombineResult.err))
            const standardObjectiveResult = StandardObjective.create({
                name: request.name,
                type: request.type,
                description: request.description,
                measureCode: request.measureCode,
                unit: request.unit,
                initialValue: request.initialValue,
                targetValue: request.targetValue,
                timeframe: request.timeframe,
                defaultRecommendation: defaultRecommendationResult.map(recommendation => recommendation.val),
            })
            if (standardObjectiveResult.isFailure) return left(new CreateStandardObjectiveErrors.CreateStandardObjectiveFailed(standardObjectiveResult.err))
            return right(Result.ok<{ id: AggregateID }>(standardObjectiveResult.val))
        } catch (error) {
            if (error instanceof StandardObjectiveError) return left(new CreateStandardObjectiveErrors.CreateStandardObjectiveError(error))
            else return left(new AppError.UnexpectedError(error))
        }
    }

}