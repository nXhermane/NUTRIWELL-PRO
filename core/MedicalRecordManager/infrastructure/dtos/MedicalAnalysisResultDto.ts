import { AggregateID } from "@shared";

export interface MedicalAnalysisResultDto {
   date: string;
   measureTypeId: AggregateID;
   value: number;
   unit: string;
}
