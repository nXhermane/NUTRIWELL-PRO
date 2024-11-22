import { AggregateID, AppServiceResponse, Message } from "@shared";
import { CreatePatientRequest, DeletePatientRequest, GetAllPatientRequest, GetPatientRequest } from "../../useCases";
import { PatientDto } from "./../../../infrastructure";

export interface IPatientService {
   createPatient(req: CreatePatientRequest): Promise<AppServiceResponse<AggregateID> | Message>;
   getPatient(req: GetPatientRequest): Promise<AppServiceResponse<PatientDto> | Message>;
   getAllPatient(req: GetAllPatientRequest): Promise<AppServiceResponse<PatientDto[]> | Message>;
   deletePatient(req: DeletePatientRequest): Promise<AppServiceResponse<boolean> | Message>;
}
