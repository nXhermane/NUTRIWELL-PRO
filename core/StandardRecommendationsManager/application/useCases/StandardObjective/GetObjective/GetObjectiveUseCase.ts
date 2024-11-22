import { AppError, left, Mapper, Result, right, UseCase } from "@/core/shared";
import { GetStandardObjectiveRequest } from "./GetObjectiveRequest";
import { GetStandardObjectiveResponse } from "./GetObjectiveResponse";
import { StandardObjective } from "@/core/StandardRecommendationsManager/domain";
import { StandardObjectiveDto, StandardObjectiveError, StandardObjectiveMapper, StandardObjectivePersistenceType, StandardObjectiveRepository } from "@/core/StandardRecommendationsManager/infrastructure";
import { GetStandardObjectiveErrors } from "./GetObjectiveErrors";

export class GetStandardObjectiveUseCase implements UseCase<GetStandardObjectiveRequest, GetStandardObjectiveResponse> {
    constructor(private repo: StandardObjectiveRepository, private mapper: Mapper<StandardObjective, StandardObjectivePersistenceType, StandardObjectiveDto>) { }
    async execute(request?: GetStandardObjectiveRequest): Promise<GetStandardObjectiveResponse> {
        try {
            if (request?.id) {
                const standardObjective = await this.repo.getById(request.id)
                return right(Result.ok<StandardObjectiveDto>(this.mapper.toResponse(standardObjective)));
            } else {
                const standardObjectives = await this.repo.getAll();
                return right(Result.ok<StandardObjectiveDto[]>(standardObjectives.map(standardObjective => this.mapper.toResponse(standardObjective))));
            }
        } catch (error) {
            if (error instanceof StandardObjectiveError) return left(new GetStandardObjectiveErrors.ObjectiveNotFoundError(error, request?.id))
            return left(new AppError.UnexpectedError(error))
        }
    }

}