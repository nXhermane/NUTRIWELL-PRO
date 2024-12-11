import { EvaluateMathExpression } from "@/core/shared";
import { PatientProfilRepository } from "../../infrastructure";
import { PatientNeedsModel } from "../entities/PatientNeedsModel";
import { IDataComposerService } from "./interfaces/DataComposerService";
import { INutritionalStandardNeedsCalculator } from "./interfaces/NutritionalStandardNeedsCalculator";
import { IPatientNeedsModelValidationService } from "./interfaces/PatientNeedsModelValidationService";
import { PatientNeedsModelValidationServiceErrors } from "./errors/PatientNeedsModelValidationServiceErrors";
// TODO: je dois remplacer cette implementation plus tard pour prendre en charge les defaults params a la place de simuler un default patient Profile 
export class PatientNeedsModelValidationService implements IPatientNeedsModelValidationService {

  constructor(private patientProfilRepo: PatientProfilRepository,
    private nutritionalStandardNeedsCalculator: INutritionalStandardNeedsCalculator,
    private dataComposer: IDataComposerService) { }

  /**
   * Validate the PatientNeedsModel by applying the defined validation rules.
   * @param patientNeedsModel - The model to validate.
   * @returns {Promise<boolean>} - True if the model is valid, false otherwise.
   */
  async validate(patientNeedsModel: PatientNeedsModel): Promise<boolean> {
    try {
      if (patientNeedsModel.isValidModel) return true
      const patientProfil = await this.patientProfilRepo.getById("default-patient") // ATTENTION: je dois remplacer cette implementation plus tard pour prendre en charge les defaults params a la place de simuler 
      const patientNeeds = await this.nutritionalStandardNeedsCalculator.generatePatientNeeds(patientProfil, patientNeedsModel)
      const unpackedPatientNeeds = patientNeeds.getProps()
      const nutrientObject = { ...unpackedPatientNeeds.energy, ...unpackedPatientNeeds.macronutrients, ...unpackedPatientNeeds.micronutrients }
      const patientNeedsModelValidationRules = patientNeedsModel.getValidationRules()
      for (const rule of patientNeedsModelValidationRules) {
        const insolvedNutrients = Object.fromEntries(rule.nutrientsInsolved.map(nutrientTagname => [nutrientTagname.toString(), nutrientObject[nutrientTagname.toString()].value]))
        const composedObject = await this.dataComposer.compose(rule.otherVariables, patientProfil)
        const expressionEvaluationResult = EvaluateMathExpression.evaluate(rule.expression.toString(), {
          ...insolvedNutrients,
          ...composedObject
        })
        if (expressionEvaluationResult != EvaluateMathExpression.ConditionResult.True) throw new PatientNeedsModelValidationServiceErrors("Erreur lors de la validation du PatientNeedsModel.", new Error(), { rule })
      }
      patientNeedsModel.isValidModel = true
      return true
    } catch (error) {
      throw new PatientNeedsModelValidationServiceErrors(
        "An error occurred during validation.",
        error as Error
      );
    }
  }
}