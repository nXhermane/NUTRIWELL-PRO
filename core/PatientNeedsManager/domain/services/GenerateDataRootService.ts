import { AggregateID, Result } from "@/core/shared";
import { DataRoot, IGenerateDataRootService } from "./interfaces/GenerateDataRoot";
import { NutritionalReferenceValueRepository, NutritionFormularRepository, PatientProfilRepository } from "../../infrastructure";
import { NutritionalReferenceValue } from "../entities/NutritionalReferenceValue";
import { NutritionFormular } from "../entities/NutritionFormular";
import { PatientProfil } from "../aggregates/PatientProfil";

export class GenerateDataRootService implements IGenerateDataRootService {
   private dataIsLoaded = false;
   private primaryData: { [systemVariableName: string]: NutritionFormular | NutritionalReferenceValue } = {};
   constructor(
      private formularRepo: NutritionFormularRepository,
      private nutritionalReferenceRepo: NutritionalReferenceValueRepository,
   ) {}

   async loadPrimaryData() {
      if (!this.dataIsLoaded) {
         const formularData = await this.formularRepo.getAll();
         const anrefData = await this.nutritionalReferenceRepo.getAll();
         formularData.forEach((formular: NutritionFormular) => (this.primaryData[formular.systemVariableName] = formular));
         anrefData.forEach((anref: NutritionalReferenceValue) => (this.primaryData[anref.systemVariableName] = anref));
         this.dataIsLoaded = true;
      }
   }
   async generate(patientProfil: PatientProfil): Promise<Result<DataRoot>> {
      try {
         await this.loadPrimaryData();
         return Result.ok<DataRoot>({
            patientProfil: patientProfil,
            ...this.primaryData,
         });
      } catch (error) {
         return Result.fail<DataRoot>("Erreur lors de la generation du PatientDataRoot");
      }
   }
}
