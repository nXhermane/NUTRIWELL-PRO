import { DomainEventHandler, EventHandler } from "domain-eventrix";
import { PatientProfilCreatedEvent, PatientProfilCreatedEventObject } from "../../domain";

@DomainEventHandler(PatientProfilCreatedEvent, {
   message: "After PatientProfil Created, create a patientDataVariable and associate to patient the appropriate PatientNeedsModel",
   isVisibleOnUI: true,
})
export class AfterPatientProfilCreatedEvent extends EventHandler<PatientProfilCreatedEventObject, PatientProfilCreatedEvent> {
   constructor() {
      super();
   }
   async execute(event: PatientProfilCreatedEvent): Promise<void> {
      await this.onPatientProfilCreated(event.data);
   }
   private async onPatientProfilCreated(eventData: PatientProfilCreatedEventObject): Promise<void> {
      // TODO: Do somethings : Implement a logic to attribute an patientNeedsModel and to create a patientDataVariable for this current patientProfil
   }
}
