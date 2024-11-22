import { PathResolver } from "smart-path-resolver";
import { NutritionalReferenceValueRepository } from "../../infrastructure/repositories/interfaces/NutritionalReferenceValueRepository";
import { NutritionFormularRepository } from "../../infrastructure/repositories/interfaces/NutritionFormularRepository";
import { NutritionalReferenceValue } from "../entities/NutritionalReferenceValue";
import { NutritionFormular } from "../entities/NutritionFormular";
import { VariableMappingTable } from "../entities/types";
import { ComposedObject, ContextType, IDataComposerService } from "./interfaces/DataComposerService";
import { INutritionFormularService } from "./interfaces/NutritionFormularService";
import { INutritionalReferenceValueService } from "./interfaces/NutritionalReferenceValueService";

export class DataComposerService implements IDataComposerService {
   private dataIsLoaded = false;
   private primaryData = {
      formular: new Map<string, NutritionFormular>(),
      anref: new Map<{ tagname: string; origin: string }, NutritionalReferenceValue>(),
   };
   constructor(
      private formularRepo: NutritionFormularRepository,
      private nutritionalReferenceRepo: NutritionalReferenceValueRepository,
      private nutritionFormularService: INutritionFormularService,
      private nutritionalReferenceValueService: INutritionalReferenceValueService,
   ) {}
   async loadPrimaryData() {
      if (!this.dataIsLoaded) {
         const formularData = await this.formularRepo.getAll();
         const anrefData = await this.nutritionalReferenceRepo.getAll();
         formularData.forEach((formular: NutritionFormular) => this.primaryData.formular.set(formular.name, formular));
         anrefData.forEach((anref: NutritionalReferenceValue) =>
            this.primaryData.anref.set({ tagname: anref.tagnames, origin: anref.origin }, anref),
         );
         this.dataIsLoaded = true;
      }
   }
   async compose<T extends ContextType = any>(variableMappingTable: VariableMappingTable, context: T): Promise<ComposedObject> {
      await this.loadPrimaryData();
      const rootObject = {
         ...this.primaryData,
         ...context,
      };
      const composedObject: ComposedObject = {};
      const pathResolver = new PathResolver(rootObject);
      for (const [key, path] of Object.entries(variableMappingTable)) {
         const pathResolvedValue = await pathResolver.resolve(path);
         if (pathResolvedValue instanceof NutritionalReferenceValue) {
            const nutRefValueVariable = await this.compose<T>(pathResolvedValue.variables, context);
            const nutritionalReferenceValueResult = this.nutritionalReferenceValueService.getNutritionalRecommendedValue(
               pathResolvedValue,
               nutRefValueVariable,
            );
            if (nutritionalReferenceValueResult.isFailure) throw new Error((nutritionalReferenceValueResult.err as any)?.message);
            composedObject[key] = nutritionalReferenceValueResult.val.value;
         } else if (pathResolvedValue instanceof NutritionFormular) {
            const formularVariables = await this.compose<T>(pathResolvedValue.variables, context);
            const nutritionFormularResult = this.nutritionFormularService.resolveFormular(pathResolvedValue, formularVariables);
            if (nutritionFormularResult.isFailure) throw new Error((nutritionFormularResult.err as any)?.message);
            composedObject[key] = nutritionFormularResult.val.value;
         } else {
            composedObject[key] = pathResolvedValue;
         }
      }
      return composedObject;
   }
}
