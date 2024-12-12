import { AggregateID, IDomainEvent } from "@/core/shared";
import { PatientProfil } from "../aggregates/PatientProfil";

export interface PatientProfilCreatedEventObject {
    patientProfil: PatientProfil
}
export class PatientProfilCreatedEvent implements IDomainEvent {
    dateTimeOccurred: Date;
    data: PatientProfilCreatedEventObject;
    constructor(eventObject: PatientProfilCreatedEventObject) {
        this.data = eventObject
        this.dateTimeOccurred = new Date()
    }
    getAggregateId(): AggregateID {
        return this.data.patientProfil.id
    }

}