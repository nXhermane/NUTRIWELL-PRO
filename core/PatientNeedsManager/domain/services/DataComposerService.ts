import { PathResolver } from "smart-path-resolver";
import { NutritionalReferenceValue } from "../entities/NutritionalReferenceValue";
import { NutritionFormular } from "../entities/NutritionFormular";
import { VariableMappingTable } from "../entities/types";
import { ComposedObject, IDataComposerService } from "./interfaces/DataComposerService";
import { INutritionFormularService } from "./interfaces/NutritionFormularService";
import { INutritionalReferenceValueService } from "./interfaces/NutritionalReferenceValueService";
import { DataRoot, IGenerateDataRootService } from "./interfaces/GenerateDataRoot";
import { AggregateID } from "@/core/shared";
import { PatientDataVariableRepository } from "../../infrastructure";

export class DataComposerService implements IDataComposerService {
   private dataComposerCatch: Map<AggregateID, { data: DataRoot; variables: Record<string, string> }> = new Map();
   private readonly maxCatchSize: number = 5;
   constructor(
      private rootGenerator: IGenerateDataRootService,
      private nutritionalReferenceValueService: INutritionalReferenceValueService,
      private nutritionFormularService: INutritionFormularService,
      private patientDataVariableRepo: PatientDataVariableRepository,
   ) {}

   async compose(variableMappingTable: VariableMappingTable, patientProfilId: AggregateID): Promise<ComposedObject> {
      // TODO: getion du cache ,
      // * Maintenant j'utilise le FIFO , mais je pourrais utiliser un cache plus avancé le Least Recently Used (LRU) ou un TTL (Time to Live)
      if (!this.dataComposerCatch.has(patientProfilId)) {
         if (this.dataComposerCatch.size >= this.maxCatchSize) {
            const firstKey = this.dataComposerCatch.keys().next().value; // Récupère la première clé
            this.dataComposerCatch.delete(firstKey as AggregateID); // Supprime la première entrée pour libérer de l'espace
         }
         const dataRoot = await this.rootGenerator.generate(patientProfilId);
         const patientDataVariable = await this.patientDataVariableRepo.getById(patientProfilId);
         const variables = patientDataVariable.variables;
         if (dataRoot.isFailure) throw new Error(String(dataRoot.err));
         this.dataComposerCatch.set(patientProfilId, { data: dataRoot.val, variables });
      }
      // recuperer les données du catch
      const dataComposerCatchObject = this.dataComposerCatch.get(patientProfilId);
      if (!dataComposerCatchObject) {
         throw new Error(`Cache miss for patient profile ID: ${patientProfilId}`);
      }
      // rootObject
      const rootObject = dataComposerCatchObject.data;
      // rootVariables : contient les noms de variables specifiques au patient Profil et les relies a leurs paths respectifs
      const rootVariables = dataComposerCatchObject.variables;

      const composedObject: ComposedObject = {};
      // le path resolver permet d'analyser les paths afin de renvoyer la valeur de la variable correspondante
      const pathResolver = new PathResolver(rootObject);

      for (const [key, variableName] of Object.entries(variableMappingTable)) {
         if (typeof variableName === "string") {
            const path = rootVariables[variableName];
            const pathResolvedValue = await pathResolver.resolve(path);
            if (pathResolvedValue instanceof NutritionalReferenceValue) {
               const nutRefValueVariable = await this.compose(pathResolvedValue.variables, patientProfilId);
               const nutritionalReferenceValueResult = this.nutritionalReferenceValueService.getNutritionalRecommendedValue(
                  pathResolvedValue,
                  nutRefValueVariable,
               );
               if (nutritionalReferenceValueResult.isFailure) throw new Error((nutritionalReferenceValueResult.err as any)?.message);
               composedObject[key] = nutritionalReferenceValueResult.val.value;
            } else if (pathResolvedValue instanceof NutritionFormular) {
               const formularVariables = await this.compose(pathResolvedValue.variables, patientProfilId);
               const nutritionFormularResult = this.nutritionFormularService.resolveFormular(pathResolvedValue, formularVariables);
               if (nutritionFormularResult.isFailure) throw new Error((nutritionFormularResult.err as any)?.message);
               composedObject[key] = nutritionFormularResult.val.value;
            } else {
               composedObject[key] = pathResolvedValue;
            }
         } else {
            composedObject[key] = variableName;
         }
      }
      return composedObject;
   }
}
