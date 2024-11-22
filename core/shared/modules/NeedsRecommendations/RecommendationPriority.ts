/**
 * Hiérarchie des priorités (du plus au moins prioritaire) pour les recommandations:
 * VITAL : Recommandations liées à la survie immédiate (allergies sévères)
 * CRITIQUE : Conditions médicales graves (insuffisance rénale sévère)
 * IMPORTANT : Conditions significatives mais non critiques 
 * STANDARD : Recommandations de base
 * PREFERENCE : Préférences personnelles du patient
 */

export enum RecommendationPriority {
   VITAL,
   CRITIQUE,
   IMPORTANT,
   STANDARD,
   PREFERENCE,
}