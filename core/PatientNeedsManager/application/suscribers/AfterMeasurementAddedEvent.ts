import { MeasurementAddedEvent } from "@/core/MedicalRecordManager/domain/events";
import { DomainEvents, IHandler } from "@/core/shared";
// TODo: Implement the handler logic here to handle the MeasurementAddedEvent. For example, save the measurement data to patientProfil or perform any necessary calculations .
export class AfterMeasurementAddedEvent implements IHandler<MeasurementAddedEvent> {
   constructor() {
      this.setupSubscriptions();
   }
   setupSubscriptions(): void {
      DomainEvents.register(this.onMeasurementAddedEvent.bind(this), MeasurementAddedEvent.name);
   }
   onMeasurementAddedEvent(event: MeasurementAddedEvent): void {
    
   }
}
