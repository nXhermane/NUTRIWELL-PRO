import { IMeasurementRemovedEventObject, MeasurementRemovedEvent } from "@/core/MedicalRecordManager/domain/events";
import { DomainEventHandler, EventHandler } from "domain-eventrix";
// TODO: Implement the handler logic here to handle the MeasurementRemovedEvent. For example, save the measurement data to patientProfil or perform any necessary calculations .
@DomainEventHandler(MeasurementRemovedEvent, {
   message: "After Measurement Removed , do something",
   isVisibleOnUI: true,
})
export class AfterMeasurementRemovedEvent extends EventHandler<IMeasurementRemovedEventObject, MeasurementRemovedEvent> {
   constructor() {
      super();
   }

   async execute(event: MeasurementRemovedEvent): Promise<void> {
      await this.onMeasurementRemovedEvent(event);
   }

   private async onMeasurementRemovedEvent(event: MeasurementRemovedEvent): Promise<void> {}
}
