import { BaseEntityProps, AggregateID } from "@shared";

export interface PatientDto extends BaseEntityProps {
   name: string;
   gender: "M" | "F" | "O";
   contact: { email: string; phoneNumber: string };
   address: {
      street?: string;
      city?: string;
      postalCode?: string;
      country: string;
   };
   birthday: string;
   occupation?: string;
   images: string[];
}
