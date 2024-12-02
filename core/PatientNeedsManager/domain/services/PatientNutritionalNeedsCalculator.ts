import { AggregateID } from "@/core/shared";
import { PatientNeeds } from "../entities/PatientNeeds";
import { IPatientNutritionalNeedsCalculator } from "./interfaces/PatientNutritionalNeedsCalculator";
import { INutritionalStandardNeedsCalculator } from "./interfaces/NutritionalStandardNeedsCalculator";
import { IApplyRecommendationToStandardNeeds } from "./interfaces/ApplyRecommendationToStandardNeeds";
import { PatientNeedsModelRepository, PatientProfilRepository } from "../../infrastructure";
import { PatientNutritionalNeedsCalculatorError } from "./errors/PatientNutritionalNeedsCalculatorError";

export class PatientNutritionalNeedsCalculator implements IPatientNutritionalNeedsCalculator {
    constructor(private patientProfilRepo: PatientProfilRepository, private patientNeedsModelRepo: PatientNeedsModelRepository, private nutritionalStandardNeedsCalculator: INutritionalStandardNeedsCalculator, private applyRecommendationToPatientNeeds: IApplyRecommendationToStandardNeeds) { }
    async generatePatientNeeds(patientProfilId: AggregateID): Promise<PatientNeeds> {
        const patientProfil = await this.patientProfilRepo.getById(patientProfilId);
        const patientNeedsModel = await this.patientNeedsModelRepo.getById(patientProfil.patientNeedsModelId);
        const standardNeeds = await this.nutritionalStandardNeedsCalculator.generatePatientNeeds(patientProfilId, patientNeedsModel);
        const patientNeeds = await this.applyRecommendationToPatientNeeds.apply(standardNeeds, patientProfil, true);
        if (patientNeeds.isFailure) throw new PatientNutritionalNeedsCalculatorError("Erreur lors de l'application des recommendations au patientStandardNeeds")
        return patientNeeds.val
    }

}