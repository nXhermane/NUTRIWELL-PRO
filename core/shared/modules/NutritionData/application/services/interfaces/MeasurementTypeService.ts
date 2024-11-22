import { Message, AppServiceResponse } from "./../../../../../application";
import {
   CreateMeasurementTypeRequest,
   DeleteMeasurementTypeRequest,
   GetAllMeasurementTypeRequest,
   GetAllMeasurementTypeIdRequest,
   GetMeasurementTypeRequest,
} from "./../../useCases";
import { MeasurementTypeDto } from "./../../../infrastructure";
import { AggregateID } from "./../../../../../domain";
export interface IMeasurementTypeService {
   getMeasureType(req: GetMeasurementTypeRequest): Promise<AppServiceResponse<MeasurementTypeDto> | Message>;
   getAllMeasureType(req: GetAllMeasurementTypeRequest): Promise<AppServiceResponse<MeasurementTypeDto[]> | Message>;
   getAllMeasureTypeId(req: GetAllMeasurementTypeIdRequest): Promise<AppServiceResponse<{ id: AggregateID; code: string }[]> | Message>;
   createMeasureType(req: CreateMeasurementTypeRequest): Promise<AppServiceResponse<{ id: AggregateID; code: string }> | Message>;
   deleteMeasureType(req: DeleteMeasurementTypeRequest): Promise<AppServiceResponse<boolean> | Message>;
}
