import { Entity, CreateEntityProps, ExceptionBase, Result } from "@shared";
import { CreateMedicalStoryProps } from "./../types";
export interface IMedicalStory {
   pathologies: string;
   drugie: string;
   personalBackground: string;
   familyBackground: string;
   otherInformation: string;
}

export class MedicalStory extends Entity<IMedicalStory> {
   constructor(createProps: CreateEntityProps<IMedicalStory>) {
      super(createProps);
   }
   get pathologies(): string {
      return this.props.pathologies;
   }
   get drugie(): string {
      return this.props.drugie;
   }
   get personalBackground(): string {
      return this.props.personalBackground;
   }
   get familyBackground(): string {
      return this.props.familyBackground;
   }
   get otherInformation(): string {
      return this.props.otherInformation;
   }
   set pathologies(value: string) {
      this.props.pathologies = value;
   }
   set drugie(value: string) {
      this.props.drugie = value;
   }
   set personalBackground(value: string) {
      this.props.personalBackground = value;
   }
   set familyBackground(value: string) {
      this.props.familyBackground = value;
   }
   set otherInformation(value: string) {
      this.props.otherInformation = value;
   }
   validate(): void {
      this._isValid = true;
   }
   static create(medicalStory?: CreateMedicalStoryProps): Result<MedicalStory> {
      try {
         const newMedicalStory = new MedicalStory({
            props: {
               pathologies: medicalStory?.pathologies || "",
               drugie: medicalStory?.drugie || "",
               personalBackground: medicalStory?.personalBackground || "",
               familyBackground: medicalStory?.familyBackground || "",
               otherInformation: medicalStory?.otherInformation || "",
            },
         });
         return Result.ok<MedicalStory>(newMedicalStory);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<MedicalStory>(`[${e.code}]:${e.message}`)
            : Result.fail<MedicalStory>(`Erreur inattendue. ${MedicalStory.constructor.name}`);
      }
   }
}
