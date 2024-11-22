// Data Composer : se charge de la recuperation des donnees a partir d'un mapping table composer du nom de la variable et du chemin vers la source de donnees

import { VariableMappingTable } from "../../entities/types";
export type ContextType = { [key: string]: any };
export type ComposedObject = {[variableName: string]: any}
export interface IDataComposerService {
   compose<T extends ContextType = any>(variableMappingTable: VariableMappingTable, context: T): Promise<ComposedObject>;
}
