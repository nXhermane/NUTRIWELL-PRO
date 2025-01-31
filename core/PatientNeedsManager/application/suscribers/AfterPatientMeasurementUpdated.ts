import { PatientMeasurementUpadatedEventObject, PatientMeasurementUpdatedEvent } from "@/core/MedicalRecordManager/domain/events";
import { DomainEventHandler, EventHandler } from "domain-eventrix";
// TODO:  I can Implement this logic later to upadted ,Removed PatientMeasure on patientProfil
@DomainEventHandler(PatientMeasurementUpdatedEvent, {
   message: "After Measurement Updated , do something",
   isVisibleOnUI: true,
})
export class AfterPatientMeasurementUpadatedEvent extends EventHandler<PatientMeasurementUpadatedEventObject, PatientMeasurementUpdatedEvent> {
   constructor() {
      super();
   }
   async execute(event: PatientMeasurementUpdatedEvent): Promise<void> {
      await this.onPatientMeasurementUpdatedEvent(event);
   }
   private async onPatientMeasurementUpdatedEvent(event: PatientMeasurementUpdatedEvent): Promise<void> {}
}
