import { BaseEntityProps } from "@shared";

export interface ConsultationInformationDto extends Omit<BaseEntityProps, "id"> {
   consultationMotive: string;
   expectations: string;
   clinicalObjective: string;
   otherInformation: string;
}
