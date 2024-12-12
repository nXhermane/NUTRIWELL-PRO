import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase } from "../../exceptions";
import { ValueObject, DomainPrimitive } from "../ValueObject";

export class HealthMetricsName extends ValueObject<string> {
   toString(): string {
      return this.props.value;
   }
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("Le nom d'une mesure de santé ne peut pas être vide.");
   }
   static create(heathMetricsNameProps: string): Result<HealthMetricsName> {
      try {
         const heathMetricsName = new HealthMetricsName({ value: heathMetricsNameProps });
         return Result.ok<HealthMetricsName>(heathMetricsName);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<HealthMetricsName>(`[${error.code}]:${error.message}`)
            : Result.fail<HealthMetricsName>(`Erreur inattendue. ${HealthMetricsName?.constructor.name}`);
      }
   }
}
