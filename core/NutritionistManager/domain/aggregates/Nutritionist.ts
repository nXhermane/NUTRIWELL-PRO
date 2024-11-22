import {
   AggregateRoot,
   CreateEntityProps,
   BaseEntityProps,
   AggregateID,
   InvalidReference,
   Guard,
   ArgumentInvalidException,
   ExceptionBase,
   Result,
   ObjectCreationError,
   HumanName,
   Email,
   PhoneNumber,
   Address,
   Contact,
   Birthday,
   Gender,
   IAddress,
   Image,
} from "@shared";
import { Speciality, ISpeciality } from "./../value-objects/Speciality";
import { ConsultationPlace, IConsultationPlace } from "./../entities/ConsultationPlace";
import { Service, IService } from "./../entities/Service";
import { CreateNutritionistProps, CreateConsultationPlaceProps, CreateServiceProps } from "./../types";
export interface INutritionist {
   name: HumanName;
   email: Email;
   contact: Contact;
   address: Address;
   birthday: Birthday;
   gender: Gender;
   images: Image[];
   specialities: Set<Speciality>;
   consultationPlaces: ConsultationPlace[];
   services: Service[];
}

export class Nutritionist extends AggregateRoot<INutritionist> {
   constructor(createProps: CreateEntityProps<INutritionist>) {
      super(createProps);
   }
   get name(): string {
      return this.props.name.fullName;
   }

   set name(name: HumanName) {
      this.props.name = name;
   }
   get email(): string {
      return this.props.email.getValue();
   }
   set email(email: Email) {
      this.props.email = email;
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
   get images(): string[] {
      return this.props.images.map((img: Image) => img.uri);
   }

   set images(images: Image[]) {
      this.props.images = images;
   }
   get specialities(): ISpeciality[] {
      return Array.from(this.props.specialities).map((speciality: Speciality) => speciality.unpack());
   }

   get consultationPlaces(): (BaseEntityProps & IConsultationPlace)[] {
      return this.props.consultationPlaces.map((consulatationPlace: ConsultationPlace) => consulatationPlace.getProps());
   }

   get services(): (BaseEntityProps & IService)[] {
      return this.props.services.map((service: Service) => service.getProps());
   }

   addSpeciality(...specialities: Speciality[]) {
      specialities.forEach((speciality: Speciality) => {
         if (!this.props.specialities.has(speciality)) this.props.specialities.add(speciality);
      });
   }

   addConsultationPlace(...consultationPlace: ConsultationPlace[]) {
      consultationPlace.forEach((consulatationPlace: ConsultationPlace) => {
         const index = this.props.consultationPlaces.findIndex((consultPlace: ConsultationPlace) => consultPlace.equals(consulatationPlace));
         if (index === -1) this.props.consultationPlaces.push(consulatationPlace);
      });
   }

   addService(...services: Service[]) {
      services.forEach((service: Service) => {
         const index = this.props.services.findIndex((serv: Service) => serv.equals(service));
         if (index === -1) this.props.services.push(service);
      });
   }

   removeConsultationPlace(consultationPlaceId: AggregateID): void {
      const index = this.props.consultationPlaces.findIndex((consultationPlace: ConsultationPlace) => consultationPlaceId === consultationPlace.id);
      if (index != -1) this.props.consultationPlaces.splice(index, 1);
   }

   removeService(serviceId: AggregateID) {
      const index = this.props.services.findIndex((service: Service) => serviceId === service.id);
      if (index != -1) this.props.services.splice(index, 1);
   }

   validate(): void {
      if (!this.props.name.isValid()) throw new ArgumentInvalidException("Le nom du nutritionniste n'est pas valide.");
      if (!this.props.email.isValid()) throw new ArgumentInvalidException("L'email du nutritionniste n'est pas valide.");
      if (!this.props.contact.isValid()) throw new ArgumentInvalidException("Le contact du nutritionniste n'est pas valide.");
      if (!this.props.address.isValid()) throw new ArgumentInvalidException("L'address du nutritionniste n'est pas valide.");
      if (!this.props.birthday.isValid()) throw new ArgumentInvalidException("La date de naissance du nutritionniste n'est pas valide.");

      this._isValid = true;
   }

   static create(createNutritionistProps: CreateNutritionistProps): Result<Nutritionist> {
      try {
         const name = HumanName.create(createNutritionistProps.name);
         if (name.isFailure) throw new ObjectCreationError((name.err as any)?.message || String(name.err));
         const email = Email.create(createNutritionistProps.email);
         if (email.isFailure) throw new ObjectCreationError((email.err as any)?.message || String(name.err));
         const birthday = Birthday.create(createNutritionistProps.birthday);
         if (birthday.isFailure) throw new ObjectCreationError((birthday.err as any)?.message || String(birthday.err));
         const gender = Gender.create(createNutritionistProps.gender);
         if (gender.isFailure) throw new ObjectCreationError((gender.err as any)?.message || String(gender.err));
         const address = Address.create(createNutritionistProps.address);
         if (address.isFailure) throw new ObjectCreationError((address.err as any)?.message || String(address.err));
         const contactEmail = Email.create(createNutritionistProps.contact.email);
         if (contactEmail.isFailure) throw new ObjectCreationError((contactEmail.err as any)?.message || String(contactEmail.err));
         const phoneNumber = PhoneNumber.create(createNutritionistProps.contact.phoneNumber);
         if (phoneNumber.isFailure) throw new ObjectCreationError((phoneNumber.err as any)?.message || String(phoneNumber.err));
         const contact = Contact.create({ email: contactEmail.val, phoneNumber: phoneNumber.val });
         if (contact.isFailure) throw new ObjectCreationError((contact.err as any)?.message || String(contact.err));
         const specialities = createNutritionistProps.specialities.map((speciality: ISpeciality) => Speciality.create(speciality));
         const specialitiesResult = Result.combine(specialities);
         if (specialitiesResult.isFailure) throw new ObjectCreationError((specialitiesResult.err as any)?.message || String(specialitiesResult.err));
         const consultationPlaces = createNutritionistProps.consultationPlaces.map((consultationPlace: CreateConsultationPlaceProps) =>
            ConsultationPlace.create(consultationPlace),
         );
         const consultationPlacesResult = Result.combine(consultationPlaces);
         if (consultationPlacesResult.isFailure)
            throw new ObjectCreationError((consultationPlacesResult.err as any)?.message || String(consultationPlacesResult.err));
         const services = createNutritionistProps.services.map((service: CreateServiceProps) => Service.create(service));
         const serviceResult = Result.combine(services);
         if (serviceResult.isFailure) throw new ObjectCreationError(serviceResult.err?.message || String(serviceResult.err));
         const images = Result.encapsulate<Image[]>(() => {
            return createNutritionistProps.images.map((uri: string) => new Image(uri)) as Image[];
         });
         if (images.isFailure) throw new ObjectCreationError((images.err as any)?.message || String(images.err));
         const nutritionist = new Nutritionist({
            props: {
               name: name.val,
               email: email.val,
               contact: contact.val,
               address: address.val,
               birthday: birthday.val,
               gender: gender.val,
               images: images.val,
               specialities: new Set(specialities.map((speciality: Result<Speciality>) => speciality.val) as Speciality[]),
               consultationPlaces: consultationPlaces.map((consultationPlace: Result<ConsultationPlace>) => consultationPlace.val),
               services: services.map((service: Result<Service>) => service.val),
            },
         });
         return Result.ok<Nutritionist>(nutritionist);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Nutritionist>(`[${e.code}]:${e.message}`)
            : Result.fail<Nutritionist>(`Erreur inattendue. ${Nutritionist.constructor.name}`);
      }
   }
}
