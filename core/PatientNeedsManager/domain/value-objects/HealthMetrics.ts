import { EmptyStringError, ExceptionBase, Guard, HealthMetricsName, HealthMetricsUnit, NegativeValueError, Result, ValueObject } from "@/core/shared";
import { CreateHealthMetricsProps } from "./types";

// TODO: je dois remodeliser les noms et code du HealthMetrics après afin d'avoir une validation de type externe  ainsi que les units
export interface IHealthMetrics {
   name: HealthMetricsName;
   code: string;
   unit: HealthMetricsUnit;
   value: number;
}

export class HealthMetrics extends ValueObject<IHealthMetrics> {
   protected validate(props: IHealthMetrics): void {
      if (Guard.isEmpty(props.code).succeeded) throw new EmptyStringError("Le code de la mesure de santé ne peut être vide");
      if (Guard.isNegative(props.value).succeeded) throw new NegativeValueError("La valeur de la mesure de santé ne peut être négative");
   }

   static create(props: CreateHealthMetricsProps): Result<HealthMetrics> {
      try {
         const healthMetricsName = HealthMetricsName.create(props.name)
         const healthMetricsUnit = HealthMetricsUnit.create(props.unit)
         const combinedResult = Result.combine([healthMetricsName, healthMetricsUnit])
         if (combinedResult.isFailure) return Result.fail<HealthMetrics>(combinedResult.err)
         const metric = new HealthMetrics({
            name: healthMetricsName.val,
            unit: healthMetricsUnit.val,
            code: props.code,
            value: props.value
         });
         return Result.ok<HealthMetrics>(metric);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<HealthMetrics>(`[${error.code}]:${error.message}`)
            : Result.fail<HealthMetrics>(`Erreur inattendue. ${HealthMetrics?.constructor.name}`);
      }
   }
}
