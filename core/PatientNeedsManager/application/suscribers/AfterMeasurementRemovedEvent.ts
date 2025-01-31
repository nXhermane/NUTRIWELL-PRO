import { IMeasurementRemovedEventObject, MeasurementRemovedEvent } from "@/core/MedicalRecordManager/domain/events";
import { Message, NutritionData, UseCase } from "@/core/shared";
import { DomainEventHandler, EventHandler } from "domain-eventrix";
import {
   RemoveHealthMetricFromPatientProfilRequest,
   RemoveHealthMetricFromPatientProfilResponse,
} from "../useCases/PatientProfil/RemoveHealthMetricFromPatientProfil";
// TODO: Implement the handler logic here to handle the MeasurementRemovedEvent. For example, save the measurement data to patientProfil or perform any necessary calculations .
@DomainEventHandler(MeasurementRemovedEvent, {
   message: "After Measurement Removed , remove this measure from PatientProfil",
   isVisibleOnUI: true,
})

export class AfterMeasurementRemovedEvent extends EventHandler<IMeasurementRemovedEventObject, MeasurementRemovedEvent> {
   constructor(private removeHealthMetricsUC: UseCase<RemoveHealthMetricFromPatientProfilRequest, RemoveHealthMetricFromPatientProfilResponse>) {
      super();
   }

   async execute(event: MeasurementRemovedEvent): Promise<void> {
      await this.onMeasurementRemovedEvent(event);
   }

   private async onMeasurementRemovedEvent(event: MeasurementRemovedEvent): Promise<void> {
      const nutritionDataInstance = await NutritionData.getInstance();
      const healthMetricCodes = await Promise.all(
         event.data.measurements.map(async (measurement) => {
            const measureTypeData = await nutritionDataInstance.measurement.getMeasureType({ idOrCode: measurement.measureTypeId });
            if (measureTypeData instanceof Message) throw new Error(measureTypeData.content);
            return measureTypeData.data.code;
         }),
      );
      await this.removeHealthMetricsUC.execute({
         patientProfilIdOrPatientId: event.data.patientId,
         healthMetricCodes: healthMetricCodes,
      });
   }
}
