import { AppServiceResponse, Message, AggregateID, UseCase } from "@/core/shared";
import {
   EatingBehaviorDto,
   FoodDiaryDto,
   ObjectiveDto,
   ConsultationInformationDto,
   FoodStoryDto,
   MedicalStoryDto,
   PersonalAndSocialStoryDto,
} from "../../infrastructure";
import {
   CreateMedicalRecordRequest,
   DeleteMedicalRecordRequest,
   CreateEatingBehaviorRequest,
   CreateFoodDiaryRequest,
   CreateObjectiveRequest,
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
   AddMeasurementRequest,
   AddMeasurementResponse,
   CreateMedicalRecordResponse,
   DeleteMedicalRecordResponse,
   CreateEatingBehaviorResponse,
   CreateFoodDiaryResponse,
   CreateObjectiveResponse,
   GetAllFoodDiaryResponse,
   GetAllObjectiveResponse,
   GetConsultationInformationResponse,
   GetFoodDiaryResponse,
   GetFoodStoryResponse,
   GetMedicalStoryResponse,
   GetObjectiveResponse,
   GetPersonalAndSocialStoryResponse,
   UpdateConsultationInformationResponse,
   UpdateFoodDiaryResponse,
   UpdateFoodStoryResponse,
   UpdateMedicalStoryResponse,
} from "../useCases";
import { IMedicalRecordService } from "./interfaces/MedicalRecordService";
import { Use } from "react-native-svg";

export class MedicalRecordService implements IMedicalRecordService {
   constructor(
      private addMeasurementUC: UseCase<AddMeasurementRequest, AddMeasurementResponse>,
      private createMedicalRecordUC: UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>,
      private deleteMedicalRecordUC: UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>,
      private createEatingBehaviorUC: UseCase<CreateEatingBehaviorRequest, CreateEatingBehaviorResponse>,
      private createFoodDiaryUC: UseCase<CreateFoodDiaryRequest, CreateFoodDiaryResponse>,
      private createObjectiveUC: UseCase<CreateObjectiveRequest, CreateObjectiveResponse>,
      private getAllFoodDiaryUC: UseCase<GetAllFoodDiaryRequest, GetAllFoodDiaryResponse>,
      private getAllObjectiveUC: UseCase<GetAllObjectiveRequest, GetAllObjectiveResponse>,
      private getConsultationInformationUC: UseCase<GetConsultationInformationRequest, GetConsultationInformationResponse>,
      private getFoodDiaryUC: UseCase<GetFoodDiaryRequest, GetFoodDiaryResponse>,
      private getFoodStoryUC: UseCase<GetFoodStoryRequest, GetFoodStoryResponse>,
      private getMedicalStoryUC: UseCase<GetMedicalStoryRequest, GetMedicalStoryResponse>,
      private getObjectiveUC: UseCase<GetObjectiveRequest, GetObjectiveResponse>,
      private getPersonalAndSocialStoryUC: UseCase<GetPersonalAndSocialStoryRequest, GetPersonalAndSocialStoryResponse>,
      private updateConsultationInformationUC: UseCase<UpdateConsultationInformationRequest, UpdateConsultationInformationResponse>,
      private updateFoodDiaryUC: UseCase<UpdateFoodDiaryRequest, UpdateFoodDiaryResponse>,
      private updateFoodStoryUC: UseCase<UpdateFoodStoryRequest, UpdateFoodStoryResponse>,
      private updateMedicalStoryUC: UseCase<UpdateMedicalStoryRequest, UpdateMedicalStoryResponse>,
   ) {}
   async addMeasurement(req: AddMeasurementRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.addMeasurementUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return {} as AppServiceResponse<void>;
   }
   async createMedicalRecord(req: CreateMedicalRecordRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.createMedicalRecordUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async deleteMedicalRecord(req: DeleteMedicalRecordRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.deleteMedicalRecordUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async createEatingBehavior(req: CreateEatingBehaviorRequest): Promise<AppServiceResponse<EatingBehaviorDto> | Message> {
      const res = await this.createEatingBehaviorUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async createFoodDiary(req: CreateFoodDiaryRequest): Promise<AppServiceResponse<AggregateID> | Message> {
      const res = await this.createFoodDiaryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async createObjective(req: CreateObjectiveRequest): Promise<AppServiceResponse<AggregateID> | Message> {
      const res = await this.createObjectiveUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getAllFoodDiary(req: GetAllFoodDiaryRequest): Promise<AppServiceResponse<FoodDiaryDto[]> | Message> {
      const res = await this.getAllFoodDiaryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getAllObjective(req: GetAllObjectiveRequest): Promise<AppServiceResponse<ObjectiveDto[]> | Message> {
      const res = await this.getAllObjectiveUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getConsultationInformation(req: GetConsultationInformationRequest): Promise<AppServiceResponse<ConsultationInformationDto> | Message> {
      const res = await this.getConsultationInformationUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getFoodDiary(req: GetFoodDiaryRequest): Promise<AppServiceResponse<FoodDiaryDto> | Message> {
      const res = await this.getFoodDiaryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getFoodStory(req: GetFoodStoryRequest): Promise<AppServiceResponse<FoodStoryDto> | Message> {
      const res = await this.getFoodStoryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getMedicalStory(req: GetMedicalStoryRequest): Promise<AppServiceResponse<MedicalStoryDto> | Message> {
      const res = await this.getMedicalStoryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getObjective(req: GetObjectiveRequest): Promise<AppServiceResponse<ObjectiveDto> | Message> {
      const res = await this.getObjectiveUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getPersonalAndSocialStory(req: GetPersonalAndSocialStoryRequest): Promise<AppServiceResponse<PersonalAndSocialStoryDto> | Message> {
      const res = await this.getPersonalAndSocialStoryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async updateConsultationinformation(req: UpdateConsultationInformationRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.updateConsultationInformationUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async updateFoodDiary(req: UpdateFoodDiaryRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.updateFoodDiaryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async updateFoodStory(req: UpdateFoodStoryRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.updateFoodStoryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async updateMedicalStory(req: UpdateMedicalStoryRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.updateMedicalStoryUC.execute(req)
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
}
