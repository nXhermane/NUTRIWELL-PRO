import { AggregateID, IAddress } from "@shared";
import { ISpeciality } from "./../../domain";
export interface Timestamps {
   createdAt: string;
   updatedAt: string;
}

export interface ConsultationPlacePersistenceType extends Timestamps {
   id: AggregateID;
   name: string;
   address: IAddress;
   isOnline: boolean;
   isPublic: boolean;
}

export interface ServicePersistenceType extends Timestamps {
   id: AggregateID;
   name: string;
   type: "Office Consultation" | "Online Consultation" | "Home Consultation" | "Other";
   patientType: "New Patient" | "Recurrent Patient" | "All Patient";
   duration: string;
   price: number;
   consultationPlaces: AggregateID[];
}

export interface NutritionistPersistenceType extends Timestamps {
   id: string;
   name: string;
   email: string;
   contact: {
      email: string;
      phoneNumber: string;
   };
   address: {
      street?: string;
      city?: string;
      postalCode?: string;
      country: string;
   };
   birthday: string;
   gender: "M" | "F" | "O";
   images: string[];
   specialities: ISpeciality[];
   consultationPlaceIds: AggregateID[];
   serviceIds: AggregateID[];
}

export interface NutritionistRecordPersistenceType extends Omit<NutritionistPersistenceType, "consultationPlaceIds" | "serviceIds"> {
   consultationPlaces: ConsultationPlacePersistenceType[];
   services: ServicePersistenceType[];
}
