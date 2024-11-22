import { ValueObject, DomainPrimitive, ArgumentOutOfRangeException, Result, ExceptionBase } from "@shared";

export class Age extends ValueObject<number> {
   static ageSupLimit = 120;
   static ageInfLimit = 0;

   getValue(): number {
      return this.props.value;
   }
   get age_y():number{
      return this.props.value
   }
   get age_m():number{
      return 12 * this.props.value
   }
   protected validate(props: DomainPrimitive<number>): void {
      if (props.value < Age.ageInfLimit || props.value > Age.ageSupLimit)
         throw new ArgumentOutOfRangeException(`Age invalide . L'age doit etre entre ${Age.ageInfLimit} et ${Age.ageSupLimit}`);
   }
   static create(value: number): Result<Age> {
      try {
         const age = new Age({ value });
         return Result.ok<Age>(age);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<Age>(`[${error.code}]:${error.message}`)
            : Result.fail<Age>(`Erreur inattendue. ${Age?.constructor.name}`);
      }
   }
}

export class AgeValidator {
   isNewBornOrInfant(age: Age): boolean {
      const value = age.getValue();
      return value >= 0 && value <= 1;
   }
   isToddler(age: Age): boolean {
      const value = age.getValue();
      return value > 1 && value <= 3;
   }
   isChild(age: Age): boolean {
      const value = age.getValue();
      return value > 3 && value <= 8;
   }
   isPreAdolescent(age: Age): boolean {
      const value = age.getValue();
      return value > 8 && value <= 13;
   }
   isAdolescent(age: Age): boolean {
      const value = age.getValue();
      return value > 13 && value <= 18;
   }
   isYoungAdult(age: Age): boolean {
      const value = age.getValue();
      return value > 18 && value <= 30;
   }
   isAdult(age: Age): boolean {
      const value = age.getValue();
      return value > 30 && value <= 50;
   }
   isMiddleAged(age: Age): boolean {
      const value = age.getValue();
      return value > 50 && value <= 70;
   }
   isSenior(age: Age): boolean {
      const value = age.getValue();
      return value > 70;
   }
}
