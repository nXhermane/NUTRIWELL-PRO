import { AggregateID } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface MeasurementAddedtoPatientProfilEventObject {
   patientProfilId: AggregateID;
   measureCode: string;
   measurePath: string;
}
@DomainEventMessage("Measurement Added to Patient Profil",true)
export class MeasurementAddedtoPatientProfilEvent extends DomainEvent<MeasurementAddedtoPatientProfilEventObject> {
   
}
