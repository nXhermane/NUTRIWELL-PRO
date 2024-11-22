import { Entity, CreateEntityProps } from "./../../../../domain";
import { EmptyStringError, ArgumentOutOfRangeException } from "./../../../../exceptions";
import { Guard, Result } from "./../../../../core";
import { PatientMeasurementCategory } from "./../../../../constants";
export interface IMeasurementType {
   name: string;
   unit: string;
   measureCategory: PatientMeasurementCategory;
   code: string;
   nameTranslate?: {
      inFrench?: string;
      inEnglish?: string;
   };
}

export class MeasurementType extends Entity<IMeasurementType> {
   constructor(createMeasureType: CreateEntityProps<IMeasurementType>) {
      super(createMeasureType);
   }
   get name(): string {
      return this.props.name;
   }
   get unit(): string {
      return this.props.unit;
   }
   get code(): string {
      return this.props.code;
   }
   get measureCategory(): PatientMeasurementCategory {
      return this.props.measureCategory;
   }
   get nameF(): string {
      return this.props?.nameTranslate?.inFrench || this.props.name;
   }
   get nameE(): string {
      return this.props?.nameTranslate?.inEnglish || this.props.name;
   }
   set nameF(value: string) {
      this.props.nameTranslate = {
         ...this.props?.nameTranslate,
         inFrench: value,
      };
   }
   set nameE(value: string) {
      this.props.nameTranslate = {
         ...this.props?.nameTranslate,
         inEnglish: value,
      };
   }
   validate(): void {
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom du tyoe de mesure ne peut etre vide");
      if (Guard.isEmpty(this.props.unit).succeeded) throw new EmptyStringError("L'unité du type de mesure ne peut etre vide");
      if (!Object.values(PatientMeasurementCategory).includes(this.props.measureCategory as PatientMeasurementCategory))
         throw new ArgumentOutOfRangeException("Cette categorie de mesure du patient n'est pas prise en charge");
      this._isValid = true;
   }
   static create(props: IMeasurementType): Result<MeasurementType> {
      try {
         const measue = new MeasurementType({ props });
         return Result.ok<MeasurementType>(measue);
      } catch (e: any) {
         if (e instanceof (ArgumentOutOfRangeException || EmptyStringError)) return Result.fail<MeasurementType>(`[${e.code}]:${e.message}`);
         return Result.fail<MeasurementType>("Erreur inattendue.");
      }
   }
}
