import { AggregateID, Result } from "@/core/shared";
import { DataRoot, IGenerateDataRootService } from "./interfaces/GenerateDataRoot";
import { NutritionalReferenceValueRepository, NutritionFormularRepository, PatientProfilRepository } from "../../infrastructure";
import { NutritionalReferenceValue } from "../entities/NutritionalReferenceValue";
import { NutritionFormular } from "../entities/NutritionFormular";

export class GenerateDataRootService implements IGenerateDataRootService {
   private dataIsLoaded = false;
   private primaryData: {
      formular: Record<string, NutritionFormular>;
      //Notation specific [Tagname]_[Origin]
      anref: Record<string, NutritionalReferenceValue>;
   } = {
      formular: {},
      anref: {},
   };
   constructor(
      private formularRepo: NutritionFormularRepository,
      private nutritionalReferenceRepo: NutritionalReferenceValueRepository,
      private patientProfilRepo: PatientProfilRepository,
   ) {}

   async loadPrimaryData() {
      if (!this.dataIsLoaded) {
         const formularData = await this.formularRepo.getAll();
         const anrefData = await this.nutritionalReferenceRepo.getAll();
         formularData.forEach((formular: NutritionFormular) => (this.primaryData.formular[formular.name] = formular));
         anrefData.forEach((anref: NutritionalReferenceValue) => (this.primaryData.anref[`${anref.tagnames}_${anref.source}`] = anref));
         this.dataIsLoaded = true;
      }
   }
   async generate(patientProfilId: AggregateID): Promise<Result<DataRoot>> {
      try {
         await this.loadPrimaryData();
         const patientProfil = await this.patientProfilRepo.getById(patientProfilId);
         return Result.ok<DataRoot>({
            ...this.primaryData,
            patientProfil: patientProfil,
         });
      } catch (error) {
         return Result.fail<DataRoot>("Erreur lors de la generation du PatientDataRoot");
      }
   }
}
