import { AggregateID, Result } from "@/core/shared";
import { PatientProfil } from "../../aggregates/PatientProfil";
import { NutritionalReferenceValue } from "../../entities/NutritionalReferenceValue";
import { NutritionFormular } from "../../entities/NutritionFormular";

export type DataRoot = { [systemVariableName: string]: NutritionFormular | NutritionalReferenceValue | PatientProfil};
export interface IGenerateDataRootService {
   generate(patientProfilId: AggregateID): Promise<Result<DataRoot>>;
}
