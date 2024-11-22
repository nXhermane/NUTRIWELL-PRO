import { AggregateID, IDomainEvent } from "@/core/shared";

export interface MeasurementDeletedFromPatientProfilEventObject {
   patientProfilId: AggregateID;
   measureName: string;
}

export class MeasurementDeletedFromPatientProfilEvent implements IDomainEvent {
   dateTimeOccurred: Date;
   data: MeasurementDeletedFromPatientProfilEventObject;
   constructor(measurementDeletedFromPatientProfilObject: MeasurementDeletedFromPatientProfilEventObject) {
      this.data = measurementDeletedFromPatientProfilObject;
      this.dateTimeOccurred = new Date();
   }
   getAggregateId(): AggregateID {
      return this.data.patientProfilId;
   }
}
