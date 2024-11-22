import { Result, ExceptionBase, NutritionData, RegistrationDate, DateManager, AppServiceResponse, MeasurementTypeDto } from "@shared";
import { CreateMeasurementProps } from "./../types";
import { AnthropometricMeasurement } from "./../value-objects/AnthropometricMeasurement";
import { BodyCompositionMeasurement } from "./../value-objects/BodyCompositionMeasurement";
import { MedicalAnalysisResult } from "./../value-objects/MedicalAnalysisResult";
export async function createMeasurementFactory(
   measurementProps: CreateMeasurementProps,
): Promise<Result<AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult>> {
   try {
      const { measurementCategory, date, ...otherProps } = measurementProps;
      const newDate = new RegistrationDate(DateManager.formatDate(date));
      const measurememt =
         measurementCategory === "Antropometry"
            ? new AnthropometricMeasurement({ date: newDate, ...otherProps })
            : measurementCategory === "BodyComposition"
              ? new BodyCompositionMeasurement({
                   date: newDate,
                   ...otherProps,
                })
              : new MedicalAnalysisResult({ date: newDate, ...otherProps });
      const measureIdsAndCategory = (
         (await (await NutritionData.getInstance()).measurement.getAllMeasureType({ measurementCategory })) as AppServiceResponse<
            MeasurementTypeDto[]
         >
      ).data.map((measurementType: MeasurementTypeDto) => ({
         id: measurementType.measureTypeId,
         category: measurementType.measurementCategory as string,
      }));
      measurememt.validateMeasure(measureIdsAndCategory);
      return Result.ok<AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult>(measurememt);
   } catch (e: any) {
      return e instanceof ExceptionBase
         ? Result.fail<AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult>(`[${e.code}]:${e.message}`)
         : Result.fail<AnthropometricMeasurement | BodyCompositionMeasurement | MedicalAnalysisResult>(`Erreur inattendue.`);
   }
}
