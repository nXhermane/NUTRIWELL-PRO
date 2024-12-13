import { AggregateID } from "@/core/shared";
// TODO : avant de lancer l'application , tu dois essayer de voir si la methode de generation de path est toujour correcte 
export const invariablePath = {
   patientProfilPath: "patientProfil",
   patientGender: "gender",
   patientAge: "age",
   patientAgeInYears: "ageYears",
   patientAgeInMonths: "ageMonths",
   patientHeight: "height",
   patientHeightInFeets: "heightInFeet",
   patientHeightInMeters: "heightInMeters",
   patientHeightInInches: "heightInInches",
   patientWeightInPounds: "weightInPounds",
   patientWeight: "weight",
   patientPhysicalActivityLevel: "physicalActivityLevel",
   patientMedicalConditionNames: "medicalConditionNames",
   patientProfilAnthropometricMeasurePath: (measureCode: string) => combinePath("anthropomethricMeasure", measureCode, "value"),
   patientProfilBodyCompositionMeasurePath: (measureCode: string) => combinePath("bodyComposition", measureCode, "value"),
   patientProfilMedicalAnalysesMeasurePath: (measureCode: string) => combinePath("medicalAnalyses", measureCode, "value"),
   patientProfilOtherInformationsPath: (otherInformationName: string) => combinePath("otherInformations", otherInformationName),
   medicalConditonPath: (medicalConditionId: AggregateID) => combinePath("medicalCondition", medicalConditionId as string),
   medicalConditionOtherInformationsPath: (otherInfotmationName: string) => combinePath("otherInformation", otherInfotmationName),
};

export const combinePath = (...paths: string[]) => paths.map((path) => path.trim()).join(".");
