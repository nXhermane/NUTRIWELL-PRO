import { AppServiceResponse, AggregateID, Message, UseCase } from "@/core/shared";
import { StandardObjectiveDto } from "../../infrastructure";
import {
   CreateStandardObjectiveRequest,
   DeleteStandardObjectiveRequest,
   GetStandardObjectiveRequest,
   UpdateStandardObjectiveRequest,
   AddRecommendationToStandardObjectiveRequest,
   RemoveRecommendationFromStandardObjectiveRequest,
   CreateStandardObjectiveResponse,
   DeleteStandardObjectiveResponse,
   GetStandardObjectiveResponse,
   UpdateStandardObjectiveResponse,
   AddRecommendationToStandardObjectiveResponse,
   RemoveRecommendationFromStandardObjectiveResponse,
} from "../useCases";
import { IStandardObjectiveService } from "./interfaces/StandardObjectiveService";

export type StandardObjectiveServiceConstructorParams = {
   createObjectiveUC: UseCase<CreateStandardObjectiveRequest, CreateStandardObjectiveResponse>;
   deleteObjectiveUC: UseCase<DeleteStandardObjectiveRequest, DeleteStandardObjectiveResponse>;
   getObjectiveUC: UseCase<GetStandardObjectiveRequest, GetStandardObjectiveResponse>;
   updateObjectiveUC: UseCase<UpdateStandardObjectiveRequest, UpdateStandardObjectiveResponse>;
   addRecommendationUC: UseCase<AddRecommendationToStandardObjectiveRequest, AddRecommendationToStandardObjectiveResponse>;
   removeRecommendationUC: UseCase<RemoveRecommendationFromStandardObjectiveRequest, RemoveRecommendationFromStandardObjectiveResponse>;
};

export class StandardObjectiveService implements IStandardObjectiveService {
   constructor(private useCases: StandardObjectiveServiceConstructorParams) {}
   async createStandardObjective(req: CreateStandardObjectiveRequest): Promise<AppServiceResponse<{ standardObjectiveId: AggregateID }> | Message> {
      const res = await this.useCases.createObjectiveUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: { standardObjectiveId: res.value.val.id } };
   }
   async deleteStandardObjective(req: DeleteStandardObjectiveRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.useCases.deleteObjectiveUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getStandardObjective(
      req: GetStandardObjectiveRequest,
   ): Promise<AppServiceResponse<StandardObjectiveDto | StandardObjectiveDto[]> | Message> {
      const res = await this.useCases.getObjectiveUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async updateStandardObjective(req: UpdateStandardObjectiveRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.useCases.updateObjectiveUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async addRecommendationToStandardObjective(req: AddRecommendationToStandardObjectiveRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.useCases.addRecommendationUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async removeRecommendationFromStandardObjective(
      req: RemoveRecommendationFromStandardObjectiveRequest,
   ): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.useCases.removeRecommendationUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
}
