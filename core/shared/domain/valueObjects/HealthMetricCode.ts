import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase } from "../../exceptions";
import { ValueObject, DomainPrimitive } from "../ValueObject";

export class HealthMetricCode extends ValueObject<string> {
   toString(): string {
      return this.props.value;
   }
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("Le code d'une mesure de santé ne peut pas être vide.");
   }
   static create(heathMetricsNameProps: string): Result<HealthMetricCode> {
      try {
         const heathMetricsName = new HealthMetricCode({ value: heathMetricsNameProps });
         return Result.ok<HealthMetricCode>(heathMetricsName);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<HealthMetricCode>(`[${error.code}]:${error.message}`)
            : Result.fail<HealthMetricCode>(`Erreur inattendue. ${HealthMetricCode?.constructor.name}`);
      }
   }
}
