import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
   AddMeasurementRequest,
   CreateEatingBehaviorRequest,
   CreateFoodDiaryRequest,
   CreateMedicalRecordRequest,
   CreateObjectiveRequest,
   DeleteMedicalRecordRequest,
   GetAllFoodDiaryRequest,
   GetAllObjectiveRequest,
   GetConsultationInformationRequest,
   GetFoodDiaryRequest,
   GetFoodStoryRequest,
   GetMedicalStoryRequest,
   GetObjectiveRequest,
   GetPersonalAndSocialStoryRequest,
   UpdateConsultationInformationRequest,
   UpdateFoodDiaryRequest,
   UpdateFoodStoryRequest,
   UpdateMedicalStoryRequest,
} from "../../useCases";
import {
   ConsultationInformationDto,
   EatingBehaviorDto,
   FoodDiaryDto,
   FoodStoryDto,
   MedicalStoryDto,
   ObjectiveDto,
   PersonalAndSocialStoryDto,
} from "./../../../infrastructure";

export interface IMedicalRecordService {
   addMeasurement(req: AddMeasurementRequest): Promise<AppServiceResponse<void> | Message>;
   createMedicalRecord(req: CreateMedicalRecordRequest): Promise<AppServiceResponse<void> | Message>;
   deleteMedicalRecord(req: DeleteMedicalRecordRequest): Promise<AppServiceResponse<boolean> | Message>;
   createEatingBehavior(req: CreateEatingBehaviorRequest): Promise<AppServiceResponse<EatingBehaviorDto> | Message>;
   createFoodDiary(req: CreateFoodDiaryRequest): Promise<AppServiceResponse<AggregateID> | Message>;
   createObjective(req: CreateObjectiveRequest): Promise<AppServiceResponse<AggregateID> | Message>;
   getAllFoodDiary(req: GetAllFoodDiaryRequest): Promise<AppServiceResponse<FoodDiaryDto[]> | Message>;
   getAllObjective(req: GetAllObjectiveRequest): Promise<AppServiceResponse<ObjectiveDto[]> | Message>;
   getConsultationInformation(req: GetConsultationInformationRequest): Promise<AppServiceResponse<ConsultationInformationDto> | Message>;
   getFoodDiary(req: GetFoodDiaryRequest): Promise<AppServiceResponse<FoodDiaryDto> | Message>;
   getFoodStory(req: GetFoodStoryRequest): Promise<AppServiceResponse<FoodStoryDto> | Message>;
   getMedicalStory(req: GetMedicalStoryRequest): Promise<AppServiceResponse<MedicalStoryDto> | Message>;
   getObjective(req: GetObjectiveRequest): Promise<AppServiceResponse<ObjectiveDto> | Message>;
   getPersonalAndSocialStory(req: GetPersonalAndSocialStoryRequest): Promise<AppServiceResponse<PersonalAndSocialStoryDto> | Message>;
   updateConsultationinformation(req: UpdateConsultationInformationRequest): Promise<AppServiceResponse<void> | Message>;
   updateFoodDiary(req: UpdateFoodDiaryRequest): Promise<AppServiceResponse<void> | Message>;
   updateFoodStory(req: UpdateFoodStoryRequest): Promise<AppServiceResponse<void> | Message>;
   updateMedicalStory(req: UpdateMedicalStoryRequest): Promise<AppServiceResponse<void> | Message>;
}
