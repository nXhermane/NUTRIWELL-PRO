import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase } from "../../exceptions";
import { DomainPrimitive, ValueObject } from "../ValueObject";

export class HealthMetricsUnit extends ValueObject<string> {
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("L'unite d'une mesure de santé ne peut être vide.");
      //TODO : Après je dois implementer la verification des unités qui n'est pas encore intéfrés maintenant
   }
   toString(): string {
      return this.props.value;
   }
   static create(value: string): Result<HealthMetricsUnit> {
      try {
         const unit = new HealthMetricsUnit({ value });
         return Result.ok<HealthMetricsUnit>(unit);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<HealthMetricsUnit>(`[${error.code}]:${error.message}`)
            : Result.fail<HealthMetricsUnit>(`Erreur inattendue. ${HealthMetricsUnit?.constructor.name}`);
      }
   }
}
