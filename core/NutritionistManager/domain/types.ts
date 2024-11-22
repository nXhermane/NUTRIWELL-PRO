import { IAddress, AggregateID } from "@shared";
import { ISpeciality } from "./value-objects/Speciality";
export type CreateConsultationPlaceProps = {
   name: string;
   address: IAddress;
   isOnline: boolean;
   isPublic: boolean;
};
export type CreateNutritionistProps = {
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
   consultationPlaces: CreateConsultationPlaceProps[];
   services: CreateServiceProps[];
};
export type CreateServiceProps = {
   name: string;
   type: "Office Consultation" | "Online Consultation" | "Home Consultation" | "Other";
   patientType: "New Patient" | "Recurrent Patient" | "All Patient";
   duration: string;
   price: number;
   consultationPlaces: AggregateID[];
};
