import { AppServiceResponse, AggregateID, Message, UseCase } from "@/core/shared";
import { StandardMedicalConditionDto } from "../../infrastructure";
import {
   CreateStandardMedicalConditionRequest,
   DeleteStandardMedicalConditionRequest,
   GetStandardMedicalConditionRequest,
   UpdateStandardMedicalConditionRequest,
   AddRecommendationToStandardMedicalConditionRequest,
   AddHealthIndicatorToMedicalConditionRequest,
   RemoveRecommendationFromStandardMedicalConditionRequest,
   RemoveHealthIndicatorFromStandardMedicalConditionRequest,
   CreateStandardMedicalConditionResponse,
   DeleteStandardMedicalConditionResponse,
   GetStandardMedicalConditionResponse,
   UpdateStandardMedicalConditionResponse,
   AddRecommendationToStandardObjectiveResponse,
   AddHealthIndicatorToMedicalConditionResponse,
   RemoveRecommendationFromStandardMedicalConditionResponse,
   RemoveHealthIndicatorFromStandardMedicalConditionResponse,
} from "../useCases";
import { IStandardMedicalConditionService } from "./interfaces/StandardMedicalConditionService";

export type StandardMedicalConditionServiceConstructorParams = {
   createMedicalConditonUC: UseCase<CreateStandardMedicalConditionRequest, CreateStandardMedicalConditionResponse>;
   delelteMedicalConditionUC: UseCase<DeleteStandardMedicalConditionRequest, DeleteStandardMedicalConditionResponse>;
   getMedicalConditionUC: UseCase<GetStandardMedicalConditionRequest, GetStandardMedicalConditionResponse>;
   updateMedicalConditionUC: UseCase<UpdateStandardMedicalConditionRequest, UpdateStandardMedicalConditionResponse>;
   addRecommendationUC: UseCase<AddRecommendationToStandardMedicalConditionRequest, AddRecommendationToStandardObjectiveResponse>;
   addHealthIndicatorUC: UseCase<AddHealthIndicatorToMedicalConditionRequest, AddHealthIndicatorToMedicalConditionResponse>;
   removeRecommendationUC: UseCase<RemoveRecommendationFromStandardMedicalConditionRequest, RemoveRecommendationFromStandardMedicalConditionResponse>;
   removeHealthIndicatorUC: UseCase<
      RemoveHealthIndicatorFromStandardMedicalConditionRequest,
      RemoveHealthIndicatorFromStandardMedicalConditionResponse
   >;
};

export class StandardMedicalConditionService implements IStandardMedicalConditionService {
   constructor(private useCases: StandardMedicalConditionServiceConstructorParams) {}
   async createStandardMedicalCondition(
      req: CreateStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<{ standardMedicalConditionId: AggregateID }> | Message> {
      const res = await this.useCases.createMedicalConditonUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: { standardMedicalConditionId: res.value.val.id } };
   }
   async deleteStandardMedicalCondition(req: DeleteStandardMedicalConditionRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.useCases.delelteMedicalConditionUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getStandardMedicalCondition(
      req: GetStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<StandardMedicalConditionDto | StandardMedicalConditionDto[]> | Message> {
      const res = await this.useCases.getMedicalConditionUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async updateStandardMedicalCondition(req: UpdateStandardMedicalConditionRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.useCases.updateMedicalConditionUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async addRecommendationToStandardMedicalCondition(
      req: AddRecommendationToStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<void> | Message> {
      const res = await this.useCases.addRecommendationUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async addHealthIndicatorToStandardMedicalCondition(req: AddHealthIndicatorToMedicalConditionRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.useCases.addHealthIndicatorUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async removeRecommendationFromStandardMedicalCondition(
      req: RemoveRecommendationFromStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.useCases.removeRecommendationUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async removeHealthIndicatorFromStandardMedicalCondition(
      req: RemoveHealthIndicatorFromStandardMedicalConditionRequest,
   ): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.useCases.removeHealthIndicatorUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
}
