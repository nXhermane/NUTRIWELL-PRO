import { ValueObject } from "./../ValueObject";
import { Guard, Result } from "./../../core";
import { EmptyStringError, ExceptionBase } from "./../../exceptions";
export class HumanName extends ValueObject<string> {
   constructor(nom: string) {
      super({ value: nom });
   }

   protected validate(props: { value: string }): void {
      if (Guard.isEmpty(props.value).succeeded) {
         throw new EmptyStringError("Le nom ne peut pas être vide.");
      }
      // Valider d'autres règles métier si nécessaire
   }

   get lastName(): string {
      const parts = this.props.value.trim().split(" ");
      return parts[parts.length - 1];
   }

   get firstName(): string {
      return this.props.value.trim().split(" ")[0];
   }

   get fullName(): string {
      return this.props.value;
   }

   toString(): string {
      return this.props.value;
   }
   static create(nom: string): Result<HumanName> {
      try {
         const name = new HumanName(nom);
         return Result.ok<HumanName>(name);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<HumanName>(`[${e.code}]:${e.message}`)
            : Result.fail<HumanName>(`Unexpected Error. ${HumanName?.constructor.name}`);
      }
   }
}
