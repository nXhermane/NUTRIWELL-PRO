import { ValueObject, ValueObjectProps } from "./../ValueObject";
import { InvalidArgumentFormatError, ExceptionBase } from "./../../exceptions";
import { Result } from "./../../core";
export class Email extends ValueObject<string> {
   private static isValidEmailFormat(value: string): boolean {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return emailRegex.test(value);
   }

   protected validate(props: ValueObjectProps<string>): void {
      if (!Email.isValidEmailFormat(props.value)) {
         throw new InvalidArgumentFormatError("Le format de l'adresse email est invalide.");
      }
   }

   static create(value: string): Result<Email> {
      try {
         const email = new Email({ value });
         return Result.ok<Email>(email);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Email>(`[${e.code}]:${e.message}`)
            : Result.fail<Email>(`Erreur inattendue. ${Email?.constructor.name}`);
      }
   }

   getValue(): string {
      return this.props.value;
   }
}
