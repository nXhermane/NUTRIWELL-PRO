import { combinePath, invariablePath } from "./VariablePathConstants";
// Ici c'est l'ensemble des variables static de patient Profil qui vont servir lors de l'ecriture des formules
export const StaticPatientVariableMappingTable: Record<string, string> = {
   AGE: combinePath(invariablePath.patientProfilPath, invariablePath.patientAge),
   AGE_IN_YEARS: combinePath(invariablePath.patientProfilPath, invariablePath.patientAgeInYears),
   AGE_IN_MONTHS: combinePath(invariablePath.patientProfilPath, invariablePath.patientAgeInMonths),
   HEIGHT: combinePath(invariablePath.patientProfilPath, invariablePath.patientHeight),
   HEIGHT_IN_FEETS: combinePath(invariablePath.patientProfilPath, invariablePath.patientHeightInFeets),
   HEIGHT_IN_METERS: combinePath(invariablePath.patientProfilPath, invariablePath.patientHeightInMeters),
   HEIGHT_IN_INCHES: combinePath(invariablePath.patientProfilPath, invariablePath.patientHeightInInches),
   WEIGHT: combinePath(invariablePath.patientProfilPath, invariablePath.patientWeight),
   WEIGHT_IN_POUNDS: combinePath(invariablePath.patientProfilPath, invariablePath.patientWeightInPounds),
   SEXE: combinePath(invariablePath.patientProfilPath, invariablePath.patientGender),
   PHYSICAL_ACTIVITY_LEVEL: combinePath(invariablePath.patientProfilPath, invariablePath.patientPhysicalActivityLevel),
   MEDICAL_CONDITION_NAMES: combinePath(invariablePath.patientProfilPath, invariablePath.patientMedicalConditionNames),
};
