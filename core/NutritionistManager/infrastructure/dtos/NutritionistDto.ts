import { AggregateID } from "@shared";
import { ConsultationPlaceDto } from "./ConsultationPlaceDto";
import { ServiceDto } from "./ServiceDto";
import { ISpeciality } from "./../../domain";
export interface NutritionistDto {
   id: AggregateID;
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
   consultationPlaces: ConsultationPlaceDto[];
   services: ServiceDto[];
}
