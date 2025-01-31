import { AppError, left, Result, right, UseCase } from "@/core/shared";
import { AddHealthMetricsToPatientProfilRequest } from "./AddHealthMetricsToPatientProfilRequest";
import { AddHealthMetricsToPatientProfilResponse } from "./AddHealthMetricsToPatientProfilResponse";
import { PatientProfilRepository, PatientProfilRepositoryError } from "@/core/PatientNeedsManager/infrastructure";
import { PatientProfil } from "@/core/PatientNeedsManager/domain";
import { CreateHealthMetricProps } from "@/core/PatientNeedsManager/domain/value-objects/types";
import { HealthMetric} from "@/core/PatientNeedsManager/domain/value-objects/HealthMetric";
import { AddHealthMetricsToPatientProfilErrors } from "./AddHealthMetricsToPatientProfilErrors";

export class AddHealthMetricsToPatientProfilUseCase
   implements UseCase<AddHealthMetricsToPatientProfilRequest, AddHealthMetricsToPatientProfilResponse>
{
   constructor(private repo: PatientProfilRepository) {}
   async execute(request: AddHealthMetricsToPatientProfilRequest): Promise<AddHealthMetricsToPatientProfilResponse> {
      try {
         const patientProfil = await this.repo.getById(request.patientProfilIdOrPatientId);
         this.addHealthMetricToPatientProfil(patientProfil, request.healthMetrics);
         await this.repo.save(patientProfil);
         return right(Result.ok<void>());
      } catch (error) {
         if (error instanceof AddHealthMetricsToPatientProfilErrors.DataValidationError) return left(error);
         else if (error instanceof PatientProfilRepositoryError)
            return left(new AddHealthMetricsToPatientProfilErrors.PatientProfilRepoError(error));
         return left(new AppError.UnexpectedError(error));
      }
   }
   private addHealthMetricToPatientProfil(patientProfil: PatientProfil, healthMetrics: CreateHealthMetricProps[]) {
      const healthMetricsResults = healthMetrics.map((healthMetricProps) => HealthMetric.create(healthMetricProps));
      const healthMetricsCombinedResult = Result.combine(healthMetricsResults);
      if (healthMetricsCombinedResult.isFailure) {
         throw new AddHealthMetricsToPatientProfilErrors.DataValidationError(healthMetricsCombinedResult.err);
      }
      healthMetricsResults.forEach((healthMetricResult) => patientProfil.addHeathMetric(healthMetricResult.val));
   }
}
