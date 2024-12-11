import {
   EmptyStringError,
   ExceptionBase,
   FormularName,
   Guard,
   NutrientTagname,
   NutritionalSource,
   ProtocolName,
   Result,
   ValueObject,
} from "@/core/shared";

export interface INutritionalVariable {
   formularOrNutrientName: NutrientTagname | FormularName | ProtocolName;
   source: NutritionalSource;
}

export class NutritionalVariable extends ValueObject<INutritionalVariable> {
   protected validate(props: INutritionalVariable): void {
      if (Guard.againstNullOrUndefined(props.source, "NutritionalSource").succeeded)
         throw new EmptyStringError("Le source de la variable nutritionnelle ne peut pas être null.");
   }
   // Méthode pour générer un nom unique de variable basé sur la source et le nutriment
   getVariableName(): string {
      const { organization, country, version, publicationYear } = this.props.source.unpack();
      let variableName = this.props.formularOrNutrientName.toString();
      if (organization.trim() != "") variableName = `${variableName}_${organization}`;
      if (country.trim() != "") variableName = `${variableName}_${country}`;
      if (String(publicationYear).trim() != "") variableName = `${variableName}_${publicationYear}`;
      return variableName;
   }
   static create(props: INutritionalVariable): Result<NutritionalVariable> {
      try {
         const nutritionalVariable = new NutritionalVariable(props);
         return Result.ok<NutritionalVariable>(nutritionalVariable);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<NutritionalVariable>(`[${e.code}]: ${e.message}`)
            : Result.fail<NutritionalVariable>(`Erreur inattendue. ${NutritionalVariable?.constructor.name}`);
      }
   }
}
