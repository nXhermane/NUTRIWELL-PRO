import { IMeasurementAddedEventObject, MeasurementAddedEvent } from "@/core/MedicalRecordManager/domain/events";
import { Message, NutritionData, PatientMeasurementCategory, UseCase } from "@/core/shared";
import {
   AddHealthMetricsToPatientProfilRequest,
   AddHealthMetricsToPatientProfilResponse,
} from "../useCases/PatientProfil/AddHealthMetricsToPatientProfil";
import { DomainEventHandler, EventHandler } from "domain-eventrix";
@DomainEventHandler(MeasurementAddedEvent, {
   message: "After Measurement Added to Medical Record, add this measure to PatientProfil",
   isVisibleOnUI: true,
})
export class AfterMeasurementAddedEvent extends EventHandler<IMeasurementAddedEventObject, MeasurementAddedEvent> {
   constructor(private addHealthMetricsUC: UseCase<AddHealthMetricsToPatientProfilRequest, AddHealthMetricsToPatientProfilResponse>) {
      super();
   }
   async execute(event: MeasurementAddedEvent): Promise<void> {
      await this.onMeasurementAddedEvent(event);
   }
   private async onMeasurementAddedEvent(event: MeasurementAddedEvent): Promise<void> {
    
      const nutritionDataInstance = await NutritionData.getInstance();
      const healthMetricsProps = await Promise.all(event.data.measurements.map(async (measurement) => {
         const measureTypeData = await nutritionDataInstance.measurement.getMeasureType({ idOrCode: measurement.measureTypeId });
         if (measureTypeData instanceof Message) throw new Error(measureTypeData.content);
         return {
            code: measureTypeData.data.code,
            value: measurement.value,
            unit: measurement.unit,
         };
      }))
       await this.addHealthMetricsUC.execute({
         patientProfilIdOrPatientId: event.data.patientId,
         healthMetrics: healthMetricsProps
       })
   }
}
