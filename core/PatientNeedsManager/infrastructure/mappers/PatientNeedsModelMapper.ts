import { Mapper, ModelType, NutritionalSource } from "@/core/shared";
import { PatientNeedsModel } from "../../domain/entities/PatientNeedsModel";
import { PatientNeedsModelPersistence } from "../repositories";
import { PatientNeedsModelDto } from "../dtos/PatientNeedsModelDto";
import { NutrientDescriptor } from "../../domain/value-objects/NutrientDescriptor";
import { PatientNeedsValidationRule } from "../../domain/value-objects/PatientNeedsValidationRule";

export class PatientModelMapper implements Mapper<PatientNeedsModel, PatientNeedsModelPersistence, PatientNeedsModelDto> {
   toPersistence(entity: PatientNeedsModel): PatientNeedsModelPersistence {
      return {
         id: entity.id as string,
         modelType: entity.modelType,
         protocolName: entity.protocolName,
         protocolSource: entity.protocolSource,
         energyMetrics: entity.getEnergyMetrics().map((nutrient) => ({
            tagname: nutrient.tagname,
            unit: nutrient.unit,
            expression: nutrient.expression,
            variables: nutrient.getVariableTable(),
         })),
         macronutrients: entity.getMacronutrients().map((nutrient) => ({
            tagname: nutrient.tagname,
            unit: nutrient.unit,
            expression: nutrient.expression,
            variables: nutrient.getVariableTable(),
         })),
         micronutrients: entity.getMicronutrients().map((nutrient) => ({
            tagname: nutrient.tagname,
            unit: nutrient.unit,
            expression: nutrient.expression,
            variables: nutrient.getVariableTable(),
         })),
         validationRules: entity.getValidationRules().map((patientValidationRule) => ({
            expression: patientValidationRule.expression.toString(),
            nutrientInsolved: patientValidationRule.nutrientsInsolved.map((tagname) => tagname.toString()),
            otherVariables: patientValidationRule.otherVariables,
         })),
         isValidModel: entity.isValidModel,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: PatientNeedsModelPersistence): PatientNeedsModel {
      const nutrientSource = NutritionalSource.create(record.protocolSource);
      const energyMetrics = record.energyMetrics.map((nutrient) => NutrientDescriptor.create(nutrient));
      const macronutrients = record.macronutrients.map((nutrient) => NutrientDescriptor.create(nutrient));
      const micronutrients = record.micronutrients.map((nutrient) => NutrientDescriptor.create(nutrient));
      const validationRules = record.validationRules.map((rule) => PatientNeedsValidationRule.create(rule));
      return new PatientNeedsModel({
         id: record.id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            modelType: record.modelType as ModelType,
            protocolName: record.protocolName,
            protocolSource: nutrientSource.val,
            energyMetrics: Object.fromEntries(energyMetrics.map((energyMetricResult) => [energyMetricResult.val.tagname, energyMetricResult.val])),
            macronutrients: Object.fromEntries(
               macronutrients.map((macronutrientResult) => [macronutrientResult.val.tagname, macronutrientResult.val]),
            ),
            micronutrients: Object.fromEntries(micronutrients.map((micronutrientRes) => [micronutrientRes.val.tagname, micronutrientRes.val])),
            validationRules: validationRules.map((rule) => rule.val),
            isValidModel: record.isValidModel,
         },
      });
   }
   toResponse(entity: PatientNeedsModel): PatientNeedsModelDto {
      const { isValidModel, ...otherProps } = this.toPersistence(entity);
      return otherProps;
   }
}
