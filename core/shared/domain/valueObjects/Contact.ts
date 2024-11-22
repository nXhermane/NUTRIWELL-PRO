import { ValueObject } from "./../ValueObject";
import { Email } from "./Email";
import { PhoneNumber } from "./PhoneNumber";
import { Result } from "./../../core";
import { ExceptionBase } from "./../../exceptions";
export interface ContactProps {
   email: Email;
   phoneNumber: PhoneNumber;
}

export class Contact extends ValueObject<ContactProps> {
   constructor(props: ContactProps) {
      super(props);
   }

   protected validate(props: ContactProps): void {
      // Validation des propriétés de contact si nécessaire
   }

   get email(): Email {
      return this.props.email;
   }

   get phoneNumber(): PhoneNumber {
      return this.props.phoneNumber;
   }

   public toString(): string {
      return `Email: ${this.email}, Phone: ${this.phoneNumber}`;
   }
   static create(props: ContactProps): Result<Contact> {
      try {
         const contact = new Contact(props);
         return Result.ok<Contact>(contact);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Contact>(`[${e.code}]:${e.message}`)
            : Result.fail<Contact>(`Erreur inattendue. ${Contact.constructor.name}`);
      }
   }
}
