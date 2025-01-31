import { ExceptionBase, Guard, HealthMetricCode, HealthMetricsUnit, NegativeValueError, Result, ValueObject } from "@/core/shared";
import { CreateHealthMetricProps } from "./types";

// TODO: je dois remodeliser les noms et code du HealthMetrics après afin d'avoir une validation de type externe  ainsi que les units
export interface IHealthMetric {
   code: HealthMetricCode;
   unit: HealthMetricsUnit;
   value: number;
}

export class HealthMetric extends ValueObject<IHealthMetric> {
   protected validate(props: IHealthMetric): void {
      if (Guard.isNegative(props.value).succeeded) throw new NegativeValueError("La valeur de la mesure de santé ne peut être négative");
   }

   static create(props: CreateHealthMetricProps): Result<HealthMetric> {
      try {
         const healthMetricCode = HealthMetricCode.create(props.code);
         const healthMetricsUnit = HealthMetricsUnit.create(props.unit);
         const combinedResult = Result.combine([healthMetricCode, healthMetricsUnit]);
         if (combinedResult.isFailure) return Result.fail<HealthMetric>(combinedResult.err);
         const metric = new HealthMetric({
            unit: healthMetricsUnit.val,
            code: healthMetricCode.val,
            value: props.value,
         });
         return Result.ok<HealthMetric>(metric);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<HealthMetric>(`[${error.code}]:${error.message}`)
            : Result.fail<HealthMetric>(`Erreur inattendue. ${HealthMetric?.constructor.name}`);
      }
   }
}
