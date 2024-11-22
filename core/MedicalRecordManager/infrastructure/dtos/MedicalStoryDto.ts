import { BaseEntityProps } from "@shared";

export interface MedicalStoryDto extends BaseEntityProps {
   pathologies: string;
   drugie: string;
   personalBackground: string;
   familyBackground: string;
   otherInformation: string;
}
