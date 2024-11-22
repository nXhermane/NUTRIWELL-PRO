import { AppServiceResponse, AggregateID, Message, UseCase } from "@shared";
import { PatientDto } from "../../infrastructure";
import {
   CreatePatientRequest,
   GetPatientRequest,
   GetAllPatientRequest,
   DeletePatientRequest,
   CreatePatientResponse,
   GetPatientResponse,
   GetAllPatientResponse,
   DeletePatientResponse,
} from "../useCases";
import { IPatientService } from "./interfaces/PatientService";

export class PatientService implements IPatientService {
   constructor(
      private createPatientUC: UseCase<CreatePatientRequest, CreatePatientResponse>,
      private getPatientUC: UseCase<GetPatientRequest, GetPatientResponse>,
      private getAllPatientUC: UseCase<GetAllPatientRequest, GetAllPatientResponse>,
      private deletePatientUC: UseCase<DeletePatientRequest, DeletePatientResponse>,
   ) {}
   async createPatient(req: CreatePatientRequest): Promise<AppServiceResponse<AggregateID> | Message> {
      const res = await this.createPatientUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getPatient(req: GetPatientRequest): Promise<AppServiceResponse<PatientDto> | Message> {
      const res = await this.getPatientUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async getAllPatient(req: GetAllPatientRequest): Promise<AppServiceResponse<PatientDto[]> | Message> {
      const res = await this.getAllPatientUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
   async deletePatient(req: DeletePatientRequest): Promise<AppServiceResponse<boolean> | Message> {
      const res = await this.deletePatientUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      return { data: res.value.val };
   }
}
