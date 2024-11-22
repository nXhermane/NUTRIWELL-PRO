import { AggregateID, IDomainEvent } from "@/core/shared";

export interface MeasurementAddedtoPatientProfilEventObject {
   patientProfilId: AggregateID;
   measureName: string;
   measurePath: string;
}
export class MeasurementAddedtoPatientProfilEvent implements IDomainEvent {
   dateTimeOccurred: Date;
   data: MeasurementAddedtoPatientProfilEventObject;
   constructor(measurementEventObject: MeasurementAddedtoPatientProfilEventObject) {
      this.data = measurementEventObject;
      this.dateTimeOccurred = new Date();
   }
   getAggregateId(): AggregateID {
      return this.data.patientProfilId;
   }
}
