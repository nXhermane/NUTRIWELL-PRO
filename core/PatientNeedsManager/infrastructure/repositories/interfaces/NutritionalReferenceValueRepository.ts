import { NutritionalReferenceValue } from "../../../domain/entities/NutritionalReferenceValue";

export interface NutritionalReferenceValueRepository {
   getByIdOrTagname(idOrTagname: string): Promise<NutritionalReferenceValue>;
   save(nutritionalReferencesValue: NutritionalReferenceValue,trx?:any): Promise<void>;
   delete(nutritionalReferencesValueId: string,trx?:any): Promise<void>;
   getAll(): Promise<NutritionalReferenceValue[]>;
}
