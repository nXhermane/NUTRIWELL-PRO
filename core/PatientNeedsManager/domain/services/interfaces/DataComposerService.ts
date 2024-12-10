// * Data Composer : se charge de la recuperation des donnees a partir d'un mapping table composer du nom de la variable et du chemin vers la source de donnees
// * Changement de context pour le datacomposer , ce n'est plus lui qui se charge de la recupperation des données a partir des sources mais plutot
// le Root Generator qui rencoie les l'element racines dans laquelle le datacomposer va naviguer avec le pathresolver pour identifier les variables.

import { PatientProfil } from "../../aggregates/PatientProfil";
import { VariableMappingTable } from "../../entities/types";
export type ComposedObject = { [variableName: string]: any };
export interface IDataComposerService {
   compose(variableMappingTable: VariableMappingTable, patientProfil: PatientProfil, additionalContext?: { [key: string]: any }): Promise<ComposedObject>;
}
