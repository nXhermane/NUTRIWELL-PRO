import { AppError, left, Mapper, Result, right, UseCase } from "@/core/shared";
import { GetStandardMedicalConditionRequest } from "./GetStandardMedicalConditionRequest";
import { GetStandardMedicalConditionResponse } from "./GetStandardMedicalConditionResponse";
import {
   StandardMedicalConditionDto,
   StandardMedicalConditionError,
   StandardMedicalConditionPersistenceType,
   StandardMedicalConditionRepository,
} from "@/core/StandardRecommendationsManager/infrastructure";
import { StandardMedicalCondition } from "@/core/StandardRecommendationsManager/domain";
import { GetStandardMedicalConditionErrors } from "./GetStandardMedicalConditionErrors";

export class GetStandardMedicalConditionUseCase implements UseCase<GetStandardMedicalConditionRequest, GetStandardMedicalConditionResponse> {
   constructor(
      private repo: StandardMedicalConditionRepository,
      private mapper: Mapper<StandardMedicalCondition, StandardMedicalConditionPersistenceType, StandardMedicalConditionDto>,
   ) {}
   async execute(request: GetStandardMedicalConditionRequest): Promise<GetStandardMedicalConditionResponse> {
      try {
         if (request.standardMedicalConditionId) {
            const standardMedicalCondition = await this.repo.getById(request.standardMedicalConditionId);
            const standardMedicalConditionDto = this.mapper.toResponse(standardMedicalCondition);
            return right(Result.ok<StandardMedicalConditionDto>(standardMedicalConditionDto));
         } else {
            const standardMedicalConditions = await this.repo.getAll();
            const standardMedicalConditionDtos = standardMedicalConditions.map((standardMedicalCondition) =>
               this.mapper.toResponse(standardMedicalCondition),
            );
            return right(Result.ok<StandardMedicalConditionDto[]>(standardMedicalConditionDtos));
         }
      } catch (error) {
         if (error instanceof StandardMedicalConditionError)
            return left(new GetStandardMedicalConditionErrors.MedicalConditionNotFoundError(error, request.standardMedicalConditionId));
         else return left(new AppError.UnexpectedError(error));
      }
   }
}
