import { AggregateID } from "@/core/shared";
import { DomainEvent, DomainEventMessage } from "domain-eventrix";

export interface MeasurementDeletedFromPatientProfilEventObject {
   patientProfilId: AggregateID;
   measureCode: string;
}

@DomainEventMessage("Measurement Deleted From Patient Profil",true)
export class MeasurementDeletedFromPatientProfilEvent extends DomainEvent<MeasurementDeletedFromPatientProfilEventObject> {

}
