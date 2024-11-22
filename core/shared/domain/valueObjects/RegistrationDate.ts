import { ArgumentInvalidException, ExceptionBase } from "../../exceptions";
import { CDate } from "./Date";
import { Result } from "./../../core";
export class RegistrationDate extends CDate {
   constructor(date: string) {
      super(date);
   }

   protected validate(props: { value: string }): void {
      super.validate(props);
      if (!this.isValideRegistrationDate(props)) {
         throw new ArgumentInvalidException("Date d'enregistrement invalide. Assurez-vous que la date n'est pas dans le future.");
      }
   }
   public isValideRegistrationDate(props?: { value: string }): boolean {
      const currentDate = new Date();
      const registrationDate = new Date(this.props.value || (props as { value: string }).value);
      return currentDate >= registrationDate;
   }
   toString(): string {
      return super.date;
   }
   static create(date: string): Result<RegistrationDate> {
      try {
         const rDate = new RegistrationDate(date);
         return Result.ok<RegistrationDate>(rDate);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<RegistrationDate>(`[${e.code}]:${e.message}`)
            : Result.fail<RegistrationDate>(`Unexpected Error. ${RegistrationDate?.constructor.name}`);
      }
   }
}
