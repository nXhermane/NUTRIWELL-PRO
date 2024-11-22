import { PatientMeasurementUpdatedEvent } from "@/core/MedicalRecordManager/domain/events";
import { DomainEvents, IHandler } from "@/core/shared";
// ToDo I can Implement this logic later to upadted ,Removed PatientMeasure on patientProfil
export class AfterPatientMeasurementUpadatedEvent implements IHandler <PatientMeasurementUpdatedEvent> 
{
    setupSubscriptions(): void {
        DomainEvents.register(this.onPatientMeasurementUpdatedEvent.bind(this), PatientMeasurementUpdatedEvent.name);
    }
    onPatientMeasurementUpdatedEvent(event: PatientMeasurementUpdatedEvent): void { 

    }
}