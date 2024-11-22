import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { DeleteStandardObjectiveRequest } from "./DeleteStandardObjectiveRequest";
import { DeleteStandardObjectiveResponse } from "./DeleteStandardObjectiveReponse";
import { StandardObjectiveError, StandardObjectiveRepository } from "../../../../infrastructure";

export class DeleteStandardObjectiveUseCase implements UseCase<DeleteStandardObjectiveRequest, DeleteStandardObjectiveResponse> {
    constructor(private repo: StandardObjectiveRepository) {}
    async execute(request: DeleteStandardObjectiveRequest): Promise<DeleteStandardObjectiveResponse> {
        try {
            await this.repo.delete(request.id)
            return right(Result.ok<boolean>(true))
        } catch (error) {
            if (error instanceof StandardObjectiveError) return right(Result.ok<boolean>(false))
            return left(new AppError.UnexpectedError(error))
        }
    }

}