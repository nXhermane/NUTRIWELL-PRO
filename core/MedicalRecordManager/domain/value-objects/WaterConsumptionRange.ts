import { ValueObject, AggregateID, Guard, ArgumentOutOfRangeException } from "@shared";

export interface IWaterConsumptionRange {
   lowerBound: number;
   upperBound: number | null;
}
export class WaterConsumptionRange extends ValueObject<IWaterConsumptionRange> {
   constructor(props: IWaterConsumptionRange) {
      super(props);
   }

   validate(props: IWaterConsumptionRange): void {
      if (Guard.isNegative(props.lowerBound)) {
         throw new ArgumentOutOfRangeException("La borne inférieure doit être supérieure ou égale à 0.");
      }

      if (props.upperBound !== null && props.upperBound <= props.lowerBound) {
         throw new ArgumentOutOfRangeException("La borne supérieure doit être supérieure à la borne inférieure.");
      }
   }

   get lowerBound(): number {
      return this.props.lowerBound;
   }

   get upperBound(): number | null {
      return this.props.upperBound;
   }

   get rangeDescription(): string {
      if (this.props.upperBound === null) {
         return `Plus de ${this.props.lowerBound}l`;
      } else if (this.props.lowerBound === 0) {
         return `Moins de ${this.props.upperBound}l`;
      } else {
         return `Entre ${this.props.lowerBound}l et ${this.props.upperBound}l`;
      }
   }
}
