import { AppError, left, Mapper, Result, right, UseCase } from "@/core/shared";
import { GetPatientDataVariableRequest } from "./GetPatientDataVariableRequest";
import { GetPatientDataVariableResponse } from "./GetPatientDataVariableResponse";
import { PatientDataVariableDto, PatientDataVariablePersistence, PatientDataVariableRepository, PatientDataVariableRepositoryError } from "../../../../infrastructure";
import { PatientDataVariable } from "../../../../domain";
import { GetPatientDataVariableErrors } from "./GetPatientDataVariableErrors";

export class GetPatientDataVariableUseCase implements UseCase<GetPatientDataVariableRequest, GetPatientDataVariableResponse> {
    constructor(private repo: PatientDataVariableRepository, private mapper: Mapper<PatientDataVariable, PatientDataVariablePersistence, PatientDataVariableDto>) { }
    async execute(request: GetPatientDataVariableRequest): Promise<GetPatientDataVariableResponse> {
        try {
            const patientDataVariable = await this.repo.getById(request.patientDataVariableOrPatientProfilId)
            return right(Result.ok<PatientDataVariableDto>(this.mapper.toResponse(patientDataVariable)))
        } catch (error) {
            if (error instanceof PatientDataVariableRepositoryError) return left(new GetPatientDataVariableErrors.PatientDataVariableNotFoundError(error))
            return left(new AppError.UnexpectedError(error))
        }
    }
}