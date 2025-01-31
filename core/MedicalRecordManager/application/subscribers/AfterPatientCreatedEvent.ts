import { PatientCreatedEvent, PatientCreatedEventData } from "@/core/PatientManager";
import { CreateMedicalRecordRequest, CreateMedicalRecordResponse } from "./../useCases";
import { UseCase } from "@shared";
import { DomainEventHandler, EventHandler } from "domain-eventrix";

@DomainEventHandler(PatientCreatedEvent,{
   message: "After Patient Created, Create a MedicalRecord",
   isVisibleOnUI: true
})
export class AfterPatientCreatedEvent extends EventHandler<PatientCreatedEventData, PatientCreatedEvent> {
   constructor(private createMedicalRecordUC: UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>) {
      super();
   }
   async execute(event: PatientCreatedEvent): Promise<void> {
     await  this.onPatientCreatedEvent(event)
   }
   private async onPatientCreatedEvent(event: PatientCreatedEvent): Promise<void> {
      await this.createMedicalRecordUC.execute({
         data: {},
         patientId: event.data.patientId,
      })
   }
}
