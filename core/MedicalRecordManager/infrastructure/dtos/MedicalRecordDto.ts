import { BaseEntityProps } from "@shared";
import { FoodDiaryDto } from "./FoodDiaryDto";
import { ConsultationInformationDto } from "./ConsultationInformationDto";
import { FoodStoryDto } from "./FoodStoryDto";
import { MedicalStoryDto } from "./MedicalStoryDto";
import { PersonalAndSocialStoryDto } from "./PersonalAndSocialStoryDto";
import { ObjectiveDto } from "./ObjectiveDto";
import { EatingBehaviorDto } from "./EatingBehaviorDto";
import { PatientMeasurementDto } from "./PatientMeasurementDto";
import { AggregateID } from "@shared";
export interface MedicalRecordDto extends BaseEntityProps {
   foodDiaries: FoodDiaryDto[];
   consultationInformation: ConsultationInformationDto;
   foodStory: FoodStoryDto;
   medicalStory: MedicalStoryDto;
   personalAndSocialStory: PersonalAndSocialStoryDto;
   objectives: ObjectiveDto[];
   eatingBehaviors: EatingBehaviorDto[];
   measure: PatientMeasurementDto;
   patientId: AggregateID;
}
