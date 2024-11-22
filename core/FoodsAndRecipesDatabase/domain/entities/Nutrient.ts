import { Entity, CreateEntityProps, BaseEntityProps, EmptyStringError, NegativeValueError, Guard, Result, ExceptionBase } from "@shared";
import {
   INVALID_NUTRIENT_VALUE_ERROR,
   INVALID_NUTRIENT_TAGNAME_ERROR,
   INVALID_NUTRIENT_CODE_ERROR,
   EMPTY_NUTRIENT_NAME_ERROR,
   INVALID_NUTRIENT_UNIT_ERROR,
   INVALID_NUTRIENT_DECIMALS_ERROR,
} from "./../constants";
import { err } from "react-native-svg";
export interface INutrient {
   nutrientCode: string;
   nutrientINFOODSTagName: string;
   nutrientName: string;
   nutrientUnit: string;
   nutrientDecimals: number;
   nutrientNameTranslate?: {
      inFrench?: string;
      inEnglish?: string;
   };
}

export class Nutrient extends Entity<INutrient> {
   constructor(createNutrient: CreateEntityProps<INutrient>) {
      super(createNutrient);
      this.validate();
   }
   get nutrientCode(): string {
      return this.props.nutrientCode;
   }
   get nutrientINFOODSTagName(): string {
      return this.props.nutrientINFOODSTagName;
   }
   get nutrientNameF(): string {
      return this.props?.nutrientNameTranslate?.inFrench ?? this.props.nutrientName;
   }
   get nutrientNameE(): string {
      return this.props?.nutrientNameTranslate?.inEnglish ?? this.props.nutrientName;
   }
   set nutrientNameF(value: string) {
      this.props.nutrientNameTranslate = {
         ...this.props.nutrientNameTranslate,
         inFrench: value,
      };
   }
   set nutrientNameE(value: string) {
      this.props.nutrientNameTranslate = {
         ...this.props.nutrientNameTranslate,
         inEnglish: value,
      };
   }
   get nutrientUnit(): string {
      return this.props.nutrientUnit;
   }
   get nutrientDecimals(): number {
      return this.props.nutrientDecimals;
   }
   public equals(object: Nutrient) {
      return (
         super.equals(object) &&
         this.props.nutrientCode === object.nutrientCode &&
         this.props.nutrientINFOODSTagName === object.nutrientINFOODSTagName
      );
   }

   validate(): void {
      if (Guard.isNegative(this.props.nutrientDecimals).succeeded) {
         throw new NegativeValueError(INVALID_NUTRIENT_DECIMALS_ERROR);
      }
      if (Guard.isEmpty(this.props.nutrientINFOODSTagName).succeeded) {
         throw new EmptyStringError(INVALID_NUTRIENT_TAGNAME_ERROR);
      }
      if (Guard.isEmpty(this.props.nutrientCode).succeeded) {
         throw new EmptyStringError(INVALID_NUTRIENT_CODE_ERROR);
      }
      if (Guard.isEmpty(this.props.nutrientName).succeeded) {
         throw new EmptyStringError(EMPTY_NUTRIENT_NAME_ERROR);
      }
      if (Guard.isEmpty(this.props.nutrientUnit).succeeded) {
         throw new EmptyStringError(INVALID_NUTRIENT_UNIT_ERROR);
      }
   }

   static create(props: INutrient): Result<Nutrient> {
      try {
         const nutrient = new Nutrient({ props });
         return Result.ok<Nutrient>(nutrient);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Nutrient>(`[${error.code}]:${error.message}`)
            : Result.fail<Nutrient>(`Erreur inattendue. ${Nutrient.constructor.name}`);
      }
   }
}
