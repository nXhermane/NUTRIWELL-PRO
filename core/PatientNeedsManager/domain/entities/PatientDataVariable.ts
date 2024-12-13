import { AggregateID, CreateEntityProps, EmptyStringError, Entity, ExceptionBase, NotFoundException, Result } from "@/core/shared";
import { CreatePatientDataVariableProps } from "../types";
import { StaticPatientVariableMappingTable } from "../constants/StaticPatientVariableMappingTable";

/**
 * Représente un ensemble de variables dynamiques associées à un patient spécifique.
 */
export interface IPatientDataVariable {
   patientProfilId: AggregateID; // L'identifiant unique du patient Profil.
   variables: Record<string, string>; // Clé-valeur pour le nom et le chemin de la variable.
}

export class PatientDataVariable extends Entity<IPatientDataVariable> {
   constructor(createProps: CreateEntityProps<IPatientDataVariable>) {  
      if (!createProps.id) {// Verifier si ce n'est pas un nouveau patient qui veux initialiser ces variables
         for (const [key, path] of Object.entries(StaticPatientVariableMappingTable)) {
            createProps.props.variables[key] = path;
         }
      }
      super(createProps)
   }
   get patientProfilId(): AggregateID {
      return this.props.patientProfilId;
   }
   get variables(): Record<string, string> {
      return this.props.variables;
   }
   updateVariable(variableName: string, value: string): void {
      this.props.variables[variableName] = value;
   }
   getVariableByName(variableName: string): [variableName: string, variablePath: string] {
      const variable = this.props.variables[variableName];
      if (variable) return [variableName, variable]; // Si la variable existe, on la retourne.
      throw new NotFoundException("La variable " + variableName + " n'est pas definie.");
   }
   deleteVariable(variableName: string): void {
      if (this.props.variables.hasOwnProperty(variableName)) delete this.props.variables[variableName];
      this.validate();
   }

   public validate(): void {
      if (this.props.patientProfilId === undefined) throw new EmptyStringError("Patient ID is required.");
      // TODO: Je vais implementer la vrai validation du patient Profil Id dans la version suivante
      this._isValid = true;
   }
   public static create(props: CreatePatientDataVariableProps): Result<PatientDataVariable> {
      try {
         const patientDataVariable = new PatientDataVariable({ props });
         return Result.ok<PatientDataVariable>(patientDataVariable);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<PatientDataVariable>(`[${error.code}]:${error.message}`)
            : Result.fail<PatientDataVariable>(`Erreur inattendue. ${PatientDataVariable?.constructor.name}`);
      }
   }
}
