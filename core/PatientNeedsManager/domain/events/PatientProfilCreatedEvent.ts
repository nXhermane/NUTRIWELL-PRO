import { PatientProfil } from "../aggregates/PatientProfil";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface PatientProfilCreatedEventObject {
   patientProfil: PatientProfil;
}
@DomainEventMessage("Patient Profil Created",true)
export class PatientProfilCreatedEvent extends DomainEvent<PatientProfilCreatedEventObject> {

}
