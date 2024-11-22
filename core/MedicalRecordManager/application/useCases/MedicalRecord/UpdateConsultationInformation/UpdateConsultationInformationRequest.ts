import { AggregateID } from "@shared";
import { CreateConsultationInformationProps } from "./../../../../domain";
export type UpdateConsultationInformationRequest = {
   patientId: AggregateID;
   data: Partial<CreateConsultationInformationProps>;
};
