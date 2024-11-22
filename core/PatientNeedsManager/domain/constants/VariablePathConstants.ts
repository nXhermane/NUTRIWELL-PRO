import { AggregateID } from "@/core/shared";

export const invariablePath = {
   patientProfilPath: "patientProfil",
   patientAge:"age",
   patientAgeInYears : "ageYears",
   patientAgeInMonths:"ageMonths",
   patientHeight: "height",
   patientHeightInFeets: "heightInFeet",
   patientHeightInMeters:"heightInMeters",
   patientHeightInInches:  "heightInInches" ,
   patientWeightInPounds: "weightInPounds",
   patientWeight: "weight",
   patientPhysicalActivityLevel:  "physicalActivityLevel",
   patientMedicalConditionNames: "medicalConditionNames",
   patientProfilAnthropometricMeasurePath: (measureCode: string) => combinePath("anthropomethricMeasure", measureCode,"value"),
   patientProfilBodyCompositionMeasurePath: (measureCode: string) => combinePath("bodyComposition", measureCode,"value"),
   patientProfilMedicalAnalysesMeasurePath: (measureCode: string) => combinePath("medicalAnalyses", measureCode,"value"),
   patientProfilOtherInformationsPath: (otherInformationName:string)=> combinePath("otherInformations",otherInformationName),
   medicalConditonPath: (medicalConditionId: AggregateID) => combinePath("medicalCondition", medicalConditionId as string),
   medicalConditionOtherInformationsPath: (otherInfotmationName: string) => combinePath("otherInformation", otherInfotmationName),
};

export const combinePath = (...paths: string[]) => paths.map((path) => path.trim()).join(".");
