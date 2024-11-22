import { AggregateID } from "@shared";
export interface Timestamps {
   createdAt: string;
   updatedAt: string;
}

export interface PatientPersistenceType extends Timestamps {
   id: string;
   name: string;
   gender: "M" | "F" | "O" | null;
   contact: { email: string; phoneNumber: string } | null;
   address: { street?: string; city?: string; postalCode?: string; country: string } | null;
   birthday: string | null;
   occupation: string | null;
   images: string[] | null;
}
