import { BaseEntityProps } from "@shared";
import { AnthropometricMeasurementDto } from "./AnthropometricMeasurementDto";
import { BodyCompositionMeasurementDto } from "./BodyCompositionMeasurementDto";
import { MedicalAnalysisResultDto } from "./MedicalAnalysisResultDto";

export interface PatientMeasurementDto extends BaseEntityProps {
   anthropometricMeasurements: AnthropometricMeasurementDto[];
   bodyCompositionMeasurements: BodyCompositionMeasurementDto[];
   medicalAnalysisResults: MedicalAnalysisResultDto[];
}
