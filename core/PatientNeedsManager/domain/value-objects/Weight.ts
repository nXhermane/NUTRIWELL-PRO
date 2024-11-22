import { ArgumentOutOfRangeException, DomainPrimitive, ExceptionBase, Result, ValueObject } from "@shared";

export class Weight extends ValueObject<number> {
   static weightInfLimit = 2;
   static weightSupLimit = 500;
   protected validate(props: DomainPrimitive<number>): void {
      if (props.value < Weight.weightInfLimit || props.value > Weight.weightSupLimit)
         throw new ArgumentOutOfRangeException(
            `Poids invalide. Le poids doit etre comprise entre ${Weight.weightInfLimit} et ${Weight.weightSupLimit}`,
         );
   }
   getValue(): number {
      return this.props.value;
   }
   toPounds(): number {
      return this.props.value * 2.20462;
   }
   toString(): string {
      return this.props.value + " " + "kg";
   }
   static create(value: number): Result<Weight> {
      try {
         const weight = new Weight({ value });
         return Result.ok<Weight>(weight);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Weight>(`[${error.code}]:${error.message}`)
            : Result.fail<Weight>(`Erreur inattendue. ${Weight?.constructor.name}`);
      }
   }
}
