import { AggregateID } from "@shared";

export interface ServiceDto {
   id: AggregateID;
   name: string;
   type: "Office Consultation" | "Online Consultation" | "Home Consultation" | "Other";
   patientType: "New Patient" | "Recurrent Patient" | "All Patient";
   duration: string;
   price: number;
   consultationPlaces: AggregateID[];
}
