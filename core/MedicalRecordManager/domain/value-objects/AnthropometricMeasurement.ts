import {
   ValueObject,
   InvalidReference,
   AggregateID,
   Guard,
   EmptyStringError,
   RegistrationDate,
   PatientMeasurementCategory,
   ArgumentInvalidException,
   NegativeValueError,
} from "@shared";

export interface IAnthropometricMeasurement {
   date: RegistrationDate;
   measureTypeId: AggregateID;
   value: number;
   unit: string;
}

export class AnthropometricMeasurement extends ValueObject<IAnthropometricMeasurement> {
   constructor(props: IAnthropometricMeasurement) {
      super(props);
   }
   get measureTypeId(): AggregateID {
      return this.props.measureTypeId;
   }
   get date(): string {
      return this.props.date.toString();
   }
   get value(): number {
      return this.props.value;
   }
   get unit(): string {
      return this.props.unit;
   }
   validateMeasure(measureData: { id: AggregateID; category: string }[]): void {
      const searchMeasureType = measureData.find((measure: { id: AggregateID; category: string }) => measure.id === this.props.measureTypeId);
      if (!searchMeasureType) throw new InvalidReference("La reference a la mesure est incorrecte.");
      if ((searchMeasureType.category as PatientMeasurementCategory) === PatientMeasurementCategory.Anthropometry)
         throw new ArgumentInvalidException("Le type de mesure ne peut etre prise en charge pas AnthropometricMeasurement.");
   }
   validate(props: IAnthropometricMeasurement): void {
      if (Guard.isEmpty(props.measureTypeId).succeeded) throw new ArgumentInvalidException("Le type de mesure doit etre fournir.");
      if (Guard.isNegative(props.value).succeeded)
         throw new NegativeValueError("La valeur d'une mesure anthropometrique ne peut etre inferieur à zéro.");
      if (Guard.isEmpty(props.unit).succeeded) throw new EmptyStringError("L'unité du mesure anthropometrique doit etre fournir.");
   }
}
