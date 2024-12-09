import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase, NegativeValueError } from "../../exceptions";
import { ValueObject } from "../ValueObject";

export interface INutritionalSource {
   organization: string; // Nom de l'organisation (ex. "OMS", "Santé Canada")
   country: string; // Pays d'origine (ex. "Canada", "États-Unis")
   publicationYear: number; // Année de publication
   version?: string; // Version spécifique (facultatif)
}
export class NutritionalSource extends ValueObject<INutritionalSource> {
   protected validate(props: INutritionalSource): void {
      if (Guard.isEmpty(props.organization).succeeded)
         throw new EmptyStringError("L'organisation doit être fourni dans lors de la definition du source nutritionnelle.");
      if (Guard.isEmpty(props.country).succeeded)
         throw new EmptyStringError("Le pays d'origine doit être fourni dans lors de la definition du source nutritionnelle.");
      if (Guard.isNegative(props.publicationYear).succeeded)
         throw new NegativeValueError("L'année de publication doit être un nombre positif dans lors de la definition du source nutritionnelle.");
   }
   
   static create(props: INutritionalSource): Result<NutritionalSource> {
      try {
         const source = new NutritionalSource(props);
         return Result.ok(source);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<NutritionalSource>(`[${e.code}]:${e.message}`)
            : Result.fail<NutritionalSource>(`Unexpected Error. ${NutritionalSource?.constructor.name}`);
      }
   }
}
