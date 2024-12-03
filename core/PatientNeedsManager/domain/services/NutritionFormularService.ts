import { AggregateID, EvaluateMathExpression, Result } from "@/core/shared";
import { VariableObject } from "../entities/NutritionalReferenceValue";
import { NutritionFormular, NutritionFormularResult } from "../entities/NutritionFormular";
import { INutritionFormularService } from "./interfaces/NutritionFormularService";
import { IFormularExpression } from "../value-objects/FormularExpression";
import { IDataComposerService } from "./interfaces/DataComposerService";

export class NutritionFormularService implements INutritionFormularService {
   constructor(private dataComposer: IDataComposerService) { }
   async resolveFormular(nutritionFormular: NutritionFormular, variableObject: VariableObject, patientProfilId: AggregateID): Promise<Result<NutritionFormularResult>> {
      try {
         const adaptedFormularResult = this.getAdaptedFormular(nutritionFormular, variableObject)
         if (adaptedFormularResult.isFailure) return Result.fail<NutritionFormularResult>(String(adaptedFormularResult.err))
         const expressionVariablesObject = await this.dataComposer.compose(adaptedFormularResult.val.expressionVariables, patientProfilId)
         const expressionResult = EvaluateMathExpression.evaluate<typeof expressionVariablesObject>(adaptedFormularResult.val.expression, expressionVariablesObject);
         return Result.ok<NutritionFormularResult>({ value: expressionResult as number | string, name: nutritionFormular.name });
      } catch (error: any) {
         return Result.fail<NutritionFormularResult>(`Erreur lors de la résolution de la formule: ${error.message}`);
      }
   }
   private getAdaptedFormular(nutritionFormular: NutritionFormular, variableObject: VariableObject): Result<IFormularExpression> {
      try {
         const formularExpressions = nutritionFormular.formularExpressions
         const adaptedFormular = formularExpressions.filter((expression: IFormularExpression) => {
            const condition = expression.condition
            const result = EvaluateMathExpression.evaluate<typeof variableObject>(condition, variableObject)
            return result === 0
         })
         if (adaptedFormular.length > 0) return Result.ok<IFormularExpression>(adaptedFormular[0])
         // TODO: Gestion du cas ou le patient ne remplisse pas les conditions
         return Result.fail<IFormularExpression>("Formulas error")
      } catch (error) {
         return Result.fail<IFormularExpression>(String((error as Error).message))
      }
   }
}
