import { AggregateID, IAddress } from "@shared";

export interface ConsultationPlaceDto {
   name: string;
   address: IAddress;
   isOnline: boolean;
   isPublic: boolean;
}
