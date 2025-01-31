import { PatientDeletedEvent, PatientDeletedEventData } from "@/core/PatientManager";
import { DeleteMedicalRecordRequest, DeleteMedicalRecordResponse } from "./../useCases";
import { UseCase } from "@shared";
import { DomainEventHandler, EventHandler } from "domain-eventrix";

@DomainEventHandler(PatientDeletedEvent,{
   message: "After Patient Deleted , delete her MedicalRecord",
   isVisibleOnUI: true
})
export class AfterPatientDeletedEvent extends EventHandler<PatientDeletedEventData, PatientDeletedEvent> {
   constructor(private deleteMedicalRecordUC: UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>) {
      super();
   }
   async execute(event: PatientDeletedEvent): Promise<void> {
      await this.onPatientDeletedEvent(event);
   }
   private async onPatientDeletedEvent(event: PatientDeletedEvent): Promise<void> {
      await this.deleteMedicalRecordUC.execute({
         patientId: event.data.patientId,
      });
   }
}
