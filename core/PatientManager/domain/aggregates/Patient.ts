import {
   AggregateRoot,
   CreateEntityProps,
   HumanName,
   Gender,
   Contact,
   Address,
   Birthday,
   ArgumentInvalidException,
   IAddress,
   Image,
   Result,
   ExceptionBase,
   PhoneNumber,
   Email,
   Sexe,
} from "@shared";
import { PatientCreatedEvent, PatientDeletedEvent } from "./../events";
import { CreatePatientProps } from "./../types";
export interface IPatient {
   name: HumanName;
   gender: Gender;
   contact: Contact;
   address: Address;
   birthday: Birthday;
   occupation?: string;
   images: Image[];
}
export class Patient extends AggregateRoot<IPatient> {
   constructor(createProps: CreateEntityProps<IPatient>) {
      super(createProps);
   }
   get name(): string {
      return this.props.name.fullName;
   }

   set name(name: HumanName) {
      this.props.name = name;
   }

   get gender(): "M" | "F" | "O" {
      return this.props.gender.sexe;
   }

   set gender(gender: Gender) {
      this.props.gender = gender;
   }

   get contact(): { email: string; phoneNumber: string } {
      return {
         email: this.props.contact.email.getValue(),
         phoneNumber: this.props.contact.phoneNumber.toString(),
      };
   }

   set contact(contact: Contact) {
      this.props.contact = contact;
   }

   get address(): IAddress {
      return this.props.address.unpack();
   }

   set address(address: Address) {
      this.props.address = address;
   }

   get birthday(): string {
      return this.props.birthday.birthday;
   }

   set birthday(birthday: Birthday) {
      this.props.birthday = birthday;
   }

   get occupation(): string | undefined {
      return this.props.occupation;
   }

   set occupation(occupation: string | undefined) {
      this.props.occupation = occupation;
   }

   get images(): string[] {
      return this.props.images.map((img: Image) => img.uri);
   }

   set images(images: Image[]) {
      this.props.images = images;
   }

   getImage(): Image[] {
      return this.props.images;
   }

   isMale(): boolean {
      return this.props.gender.isMale();
   }

   isFemale(): boolean {
      return this.props.gender.isFemale();
   }
   get age(): number {
      return this.props.birthday.age;
   }
   validate(): void {
      if (!this.props.name.isValid()) throw new ArgumentInvalidException("Le nom du patient doit etre valide");
      if (!this.props.gender.isValid()) throw new ArgumentInvalidException("Le genre du patient doit etre valide");
      if (!this.props.contact.isValid()) throw new ArgumentInvalidException("Le contact du patient doit etre valide");
      if (!this.props.address.isValid()) throw new ArgumentInvalidException("L'address du patient doit etre valide");
      if (!this.props.birthday.isValid() || this.props.birthday.age < 5)
         throw new ArgumentInvalidException("La date de naissance du patient doit etre valide ou l'age doit au moins 5 ans");
   }

   static create(createPatientProps: CreatePatientProps): Result<Patient> {
      try {
         const name = new HumanName(createPatientProps.name);
         const gender = new Gender(createPatientProps.gender as Sexe);
         const contact = new Contact({
            email: Email.create(createPatientProps.contact.email).val,
            phoneNumber: new PhoneNumber(createPatientProps.contact.tel),
         });
         const address = new Address({ ...createPatientProps.address });
         const birthday = new Birthday(createPatientProps.birthday);
         const occupation = createPatientProps?.occupation || "";
         const images = createPatientProps.images.map((uri: string) => new Image(uri));
         const newPatient = new Patient({
            props: {
               name,
               gender,
               contact,
               address,
               birthday,
               occupation,
               images,
            },
         });
         newPatient.addDomainEvent(new PatientCreatedEvent(newPatient.id));
         return Result.ok<Patient>(newPatient);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Patient>(`[${e.code}]:${e.message}`)
            : Result.fail<Patient>(`Erreur inattendue. ${Patient.constructor.name}`);
      }
   }
   public delete(): void {
      if (!this.isDeleted) {
         super.delete();
         this.addDomainEvent(new PatientDeletedEvent(this.id))
      }
   }
}
