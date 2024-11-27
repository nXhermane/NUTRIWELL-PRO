import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { DeleteStandardMedicalConditionRequest } from "./DeleteStandardMedicalConditionRequest";
import { DeleteStandardMedicalConditionResponse } from "./DeleteStandardMedicalConditionResponse";
import { StandardMedicalConditionError, StandardMedicalConditionRepository } from "@/core/StandardRecommendationsManager/infrastructure";

export class DeleteStandardMedicalConditionUseCase implements UseCase<DeleteStandardMedicalConditionRequest, DeleteStandardMedicalConditionResponse> {
    constructor(private repo: StandardMedicalConditionRepository) { }
    async execute(request: DeleteStandardMedicalConditionRequest): Promise<DeleteStandardMedicalConditionResponse> {
        try {
            await this.repo.delete(request.standardMedicalConditionId)
            return right(Result.ok<boolean>(true))

        } catch (error) {
            if (error instanceof StandardMedicalConditionError) return right(Result.ok<boolean>(false))
            else return left(new AppError.UnexpectedError(error))
        }
    }

}