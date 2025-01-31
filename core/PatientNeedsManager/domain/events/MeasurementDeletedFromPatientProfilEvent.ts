import { AggregateID } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface MeasurementDeletedFromPatientProfilEventObject {
   patientProfilId: AggregateID;
   measureName: string;
}

@DomainEventMessage("Measurement Deleted From Patient Profil",true)
export class MeasurementDeletedFromPatientProfilEvent extends DomainEvent<MeasurementDeletedFromPatientProfilEventObject> {

}
