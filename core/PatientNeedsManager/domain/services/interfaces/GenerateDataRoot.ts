import { AggregateID, Result } from "@/core/shared";
import { PatientProfil } from "../../aggregates/PatientProfil";
import { NutritionalReferenceValue } from "../../entities/NutritionalReferenceValue";
import { NutritionFormular } from "../../entities/NutritionFormular";

export type DataRoot = {
   patientProfil: PatientProfil;
   formular: Record<string, NutritionFormular>;
   // Note: Notation speciale pour les anrefs, pour rendre le key d'un anref le plus specifique possible , on utilise le format suivant : [Tagname]_[origin]
   anref: Record<string, NutritionalReferenceValue>;
};
export interface IGenerateDataRootService {
   generate(patientProfilId: AggregateID): Promise<Result<DataRoot>>;
}
