import { IMeasurementTypeService } from "./interfaces/MeasurementTypeService";
import {
   CreateMeasurementTypeRequest,
   CreateMeasurementTypeResponse,
   DeleteMeasurementTypeRequest,
   GetMeasurementTypeResponse,
   GetAllMeasurementTypeRequest,
   GetAllMeasurementTypeResponse,
   GetAllMeasurementTypeIdRequest,
   DeleteMeasurementTypeResponse,
   GetMeasurementTypeRequest,
   GetAllMeasurementTypeIdResponse,
} from "./../useCases";
import { Message, AppServiceResponse, UseCase } from "./../../../../application";
import { AggregateID } from "./../../../../domain";
import { MeasurementTypeDto } from "./../../infrastructure";
export class MeasurementTypeService implements IMeasurementTypeService {
   constructor(
      private createUC: UseCase<CreateMeasurementTypeRequest, CreateMeasurementTypeResponse>,
      private getUC: UseCase<GetMeasurementTypeRequest, GetMeasurementTypeResponse>,
      private getAllUC: UseCase<GetAllMeasurementTypeRequest, GetAllMeasurementTypeResponse>,
      private getAllIdUC: UseCase<GetAllMeasurementTypeIdRequest, GetAllMeasurementTypeIdResponse>,
      private deleteUC: UseCase<DeleteMeasurementTypeRequest, DeleteMeasurementTypeResponse>,
   ) {}

   async createMeasureType(req: CreateMeasurementTypeRequest): Promise<AppServiceResponse<{ id: AggregateID; code: string }> | Message> {
      const res = await this.createUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val };
      }
   }
   async getMeasureType(req: GetMeasurementTypeRequest): Promise<AppServiceResponse<MeasurementTypeDto> | Message> {
      const res = await this.getUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val };
      }
   }
   async getAllMeasureType(req: GetAllMeasurementTypeRequest): Promise<AppServiceResponse<MeasurementTypeDto[]> | Message> {
      const res = await this.getAllUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res?.value.err));
      } else {
         return { data: res?.value.val };
      }
   }
   async getAllMeasureTypeId(req: GetAllMeasurementTypeIdRequest): Promise<AppServiceResponse<{ id: AggregateID; code: string }[]> | Message> {
      const res = await this.getAllIdUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val };
      }
   }
   async deleteMeasureType(req: DeleteMeasurementTypeRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.deleteUC.execute(req);
      if (res.isLeft()) {
         return new Message("error", JSON.stringify(res.value.err));
      } else {
         return { data: res.value.val };
      }
   }
}
