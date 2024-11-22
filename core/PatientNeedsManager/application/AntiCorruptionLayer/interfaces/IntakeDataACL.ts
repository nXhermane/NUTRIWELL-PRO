import { Intake } from "../../../domain/value-objects/Intake";
import { AggregateID, Result } from "@/core/shared";

export interface IIntakeDataACL {
    getIntakeByPatientId(patientId:AggregateID) : Promise<Result<Intake[]>>
}