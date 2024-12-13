import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { CreatePatientDataVariableRequest } from "./CreatePatientDataVariableRequest";
import { CreatePatientDataVariableResponse } from "./CreatePatientDataVariableResponse";
import { CreatePatientDataVariableProps } from "../../../../domain/types";
import { PatientDataVariableRepository, PatientDataVariableRepositoryError } from "../../../..//infrastructure";
import { PatientDataVariable } from "./../../../../domain";
import { CreatePatientDataVariableErrors } from "./CreatePatientDataVariableErrors";

export class CreatePatientDataVariableUseCase implements UseCase<CreatePatientDataVariableRequest, CreatePatientDataVariableResponse> {
    constructor(private repo: PatientDataVariableRepository) { }
    async execute(request: CreatePatientDataVariableProps): Promise<CreatePatientDataVariableResponse> {
        try {
            const patientDataVariable = PatientDataVariable.create(request)
            if (patientDataVariable.isFailure) return left(new CreatePatientDataVariableErrors.PatientDataVariableFactoryError(patientDataVariable.err))
            // TODO: on peut envisager une validation du patientDataVariable avant sont sauvegarde puisque on a besoin de savoir si le patientProfil existe 
            await this.repo.save(patientDataVariable.val)
            return right(Result.ok<void>());
        } catch (error) {
            if (error instanceof PatientDataVariableRepositoryError) return left(new CreatePatientDataVariableErrors.PatientDataVariableRepoError(error))
            return left(new AppError.UnexpectedError(error))
        }
    }
} 