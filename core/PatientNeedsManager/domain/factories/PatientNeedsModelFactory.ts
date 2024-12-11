import { ModelType, NutritionalSource, ProtocolName, Result } from "@/core/shared";
import { IPatientNeedsModel, PatientNeedsModel } from "../entities/PatientNeedsModel";
import { CreatePatientNeedsModel } from "../entities/types";
import { IPatientNeedsModelFactory } from "./interfaces/IPatientNeedsModelFactory";
import { IPatientNeedsModelValidationService } from "../services/interfaces/PatientNeedsModelValidationService";
import { NutritionalVariable } from "../value-objects/NutritionalVariable";
import { NutrientDescriptor } from "../value-objects/NutrientDescriptor";
import { PatientNeedsValidationRule } from "../value-objects/PatientNeedsValidationRule";
import { PatientNeedsModelValidationServiceErrors } from "../services/errors/PatientNeedsModelValidationServiceErrors";

export class PatientNeedsModelFactory implements IPatientNeedsModelFactory {
    constructor(private patientNeedsModelValidationService: IPatientNeedsModelValidationService) { }
    async create(createPatientNeedsModelProps: CreatePatientNeedsModel): Promise<Result<PatientNeedsModel>> {
        try {
            const modelType = createPatientNeedsModelProps.modelType as ModelType
            const macronutrientsResult = createPatientNeedsModelProps.macronutrients.map(value => NutrientDescriptor.create(value))
            const micronutrimentsResult = createPatientNeedsModelProps.micronutrients.map(value => NutrientDescriptor.create(value))
            const energyMetricsResult = createPatientNeedsModelProps.energyMetrics.map(value => NutrientDescriptor.create(value))
            const validationRulesResult = createPatientNeedsModelProps.validationRules.map(value => PatientNeedsValidationRule.create(value))
            const isValidModel = false;// isValidModel est toujour initialisé a false lors de la creation d'un NeedsModel
            const combinedResult = Result.combine([...macronutrientsResult, ...micronutrimentsResult, ...energyMetricsResult, ...validationRulesResult])
            if (combinedResult.isFailure) {
                return Result.fail<PatientNeedsModel>(`Validation échouée pour les composants : ${combinedResult.err}`);
            }
            const props: IPatientNeedsModel = {
                modelType,
                macronutrients: Object.fromEntries(macronutrientsResult.map(nutrient => [nutrient.val.tagname, nutrient.val])),
                micronutrients: Object.fromEntries(micronutrimentsResult.map(nutrient => [nutrient.val.tagname, nutrient.val])),
                energyMetrics: Object.fromEntries(energyMetricsResult.map(nutrient => [nutrient.val.tagname, nutrient.val])),
                validationRules: validationRulesResult.map(rule => rule.val),
                isValidModel,

            }

            if (createPatientNeedsModelProps.protocolSource) {
                const sourceResult = NutritionalSource.create(createPatientNeedsModelProps.protocolSource)
                if (sourceResult.isFailure) return Result.fail<PatientNeedsModel>(String(sourceResult.err))
                const protocolNameResult = NutritionalVariable.create({
                    formularOrNutrientName: ProtocolName.create().val,
                    source: sourceResult.val
                })
                if (protocolNameResult.isFailure) return Result.fail<PatientNeedsModel>(String(sourceResult.err))
                const protocolSource = sourceResult.val
                const protocolName = protocolNameResult.val
                props["protocolSource"] = protocolSource
                props["protocolName"] = protocolName.getVariableName()

            }

            const patientNeedsModel = new PatientNeedsModel({ props })
            const isModelValid = await this.patientNeedsModelValidationService.validate(patientNeedsModel);
            if (!isModelValid) {
                return Result.fail<PatientNeedsModel>("Validation finale échouée pour PatientNeedsModel. Vérifiez les règles et les données fournies.");
            }
            return Result.ok<PatientNeedsModel>(patientNeedsModel)
        } catch (error) {
            if (error instanceof PatientNeedsModelValidationServiceErrors) {
                return Result.fail<PatientNeedsModel>(`ValidationService error: ${error.toJSON()}`);
            }
            return Result.fail<PatientNeedsModel>(`Unexpected error: ${String(error)}`);
        }
    }

}