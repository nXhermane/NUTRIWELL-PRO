
import { PatientCreatedEvent } from "@/core/PatientManager";
import { CreateMedicalRecordRequest, CreateMedicalRecordResponse } from "./../useCases";
import { IHandler, UseCase, DomainEvents } from "@shared";

export class AfterPatientCreatedEvent implements IHandler<PatientCreatedEvent> {
   constructor(private createMedicalRecordUC: UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>) {
      this.setupSubscriptions();
   }
   setupSubscriptions(): void {
      DomainEvents.register(this.onPatientCreatedEvent.bind(this), PatientCreatedEvent.name);
   }
   onPatientCreatedEvent(event: PatientCreatedEvent): void {
      (
         this.createMedicalRecordUC.execute({
            data: {},
            patientId: event.getAggregateId(),
         }) as Promise<CreateMedicalRecordResponse>
      )
         .then(() => {
            console.log("MedicalRecordId Created For Patient", event.getAggregateId());
         })
         .catch(() => {
            console.log("Error To create MedicalRecord for Patient", event.getAggregateId());
         });
   }
}
