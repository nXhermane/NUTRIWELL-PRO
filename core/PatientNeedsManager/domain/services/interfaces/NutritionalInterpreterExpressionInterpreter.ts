import { PatientProfil } from "../../entities/PatientProfil";

export interface NutritionalInterpreterExpressionInterpreter {
    interpret(patientProfil:PatientProfil):void;
}