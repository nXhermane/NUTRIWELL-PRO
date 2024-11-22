import { AggregateID, EmptyStringError, ExceptionBase, Guard, NegativeValueError, Result, ValueObject } from "@/core/shared";

export interface IHealthMetrics {
   name: string;
   code: string;
   unit: string;
   value: number;
}

export class HealthMetrics extends ValueObject<IHealthMetrics> {
   protected validate(props: IHealthMetrics): void {
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("Le nom de la mesure de santé ne peut être vide");
      if (Guard.isEmpty(props.code).succeeded) throw new EmptyStringError("Le code de la mesure de santé ne peut être vide");
      if (Guard.isNegative(props.value).succeeded) throw new NegativeValueError("La valeur de la mesure de santé ne peut être négative");
      if (Guard.isEmpty(props.unit).succeeded) throw new EmptyStringError("L'unité de la valeur du mesure de santé ne peut etre vide.");
   }

   static create(props: IHealthMetrics): Result<HealthMetrics> {
      try {
         const metric = new HealthMetrics(props);
         return Result.ok<HealthMetrics>(metric);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<HealthMetrics>(`[${error.code}]:${error.message}`)
            : Result.fail<HealthMetrics>(`Erreur inattendue. ${HealthMetrics?.constructor.name}`);
      }
   }
}
