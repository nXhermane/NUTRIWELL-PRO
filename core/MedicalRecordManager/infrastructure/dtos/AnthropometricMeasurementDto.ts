import { AggregateID } from "@shared";

export interface AnthropometricMeasurementDto {
   date: string;
   measureTypeId: AggregateID;
   value: number;
   unit: string;
}
