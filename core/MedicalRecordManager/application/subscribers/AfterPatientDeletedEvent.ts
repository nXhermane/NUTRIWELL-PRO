import { PatientDeletedEvent } from "@/core/PatientManager";
import { DeleteMedicalRecordRequest, DeleteMedicalRecordResponse } from "./../useCases";
import { IHandler, UseCase, DomainEvents } from "@shared";

export class AfterPatientDeletedEvent implements IHandler<PatientDeletedEvent> {
   constructor(private deleteMedicalRecordUC: UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>) {
      this.setupSubscriptions();
   }
   setupSubscriptions(): void {
      DomainEvents.register(this.onPatientDeletedEvent.bind(this), PatientDeletedEvent.name);
   }
   onPatientDeletedEvent(event: PatientDeletedEvent): void {
      (
         this.deleteMedicalRecordUC.execute({
            patientId: event.getAggregateId(),
         }) as Promise<DeleteMedicalRecordResponse>
      )
         .then(() => {
            console.log("MedicalRecordId  delete of  Patient", event.getAggregateId());
         })
         .catch(() => {
            console.log("Error To delete MedicalRecord of Patient", event.getAggregateId());
         });
   }
}
