import { MeasurementRemovedEvent } from "@/core/MedicalRecordManager/domain/events";
import { DomainEvents, IHandler } from "@/core/shared";
// TODO: Implement the handler logic here to handle the MeasurementRemovedEvent. For example, save the measurement data to patientProfil or perform any necessary calculations .
export class AfterMeasurementRemovedEvent implements IHandler<MeasurementRemovedEvent> {
   constructor() {
      this.setupSubscriptions();
   }
   setupSubscriptions(): void {
      DomainEvents.register(this.onMeasurementRemovedEvent.bind(this), MeasurementRemovedEvent.name);
   }
   onMeasurementRemovedEvent(event: MeasurementRemovedEvent): void {}
}
