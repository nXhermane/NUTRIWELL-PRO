import {
   Entity,
   CreateEntityProps,
   BaseEntityProps,
   Guard,
   ArgumentInvalidException,
   ArgumentOutOfRangeException,
   NegativeValueError,
   Result,
   ExceptionBase,
   Address,
   IAddress,
   EmptyStringError,
   ObjectCreationError,
   Time,
   AggregateID,
   NutritionistServicePatientType,
   NutritionistServiceType,
} from "@shared";
import { CreateServiceProps } from "./../types";
export interface IService {
   name: string;
   type: NutritionistServiceType;
   patientType: NutritionistServicePatientType;
   duration: Time;
   price: number;
   consultationPlaces: Set<AggregateID>;
}

export class Service extends Entity<IService> {
   constructor(createServiceProps: CreateEntityProps<IService>) {
      super(createServiceProps);
   }

   get name(): string {
      return this.props.name;
   }
   set name(name: string) {
      this.props.name = name;
   }
   get type(): "Office Consultation" | "Online Consultation" | "Home Consultation" | "Other" {
      return this.props.type as "Office Consultation" | "Online Consultation" | "Home Consultation" | "Other";
   }
   set type(type: "Office Consultation" | "Online Consultation" | "Home Consultation" | "Other") {
      this.props.type as NutritionistServiceType;
   }
   get patientType(): "New Patient" | "Recurrent Patient" | "All Patient" {
      return this.props.patientType as "New Patient" | "Recurrent Patient" | "All Patient";
   }
   set patientType(patientType: "New Patient" | "Recurrent Patient" | "All Patient") {
      this.props.patientType = patientType as NutritionistServicePatientType;
   }
   get duration(): string {
      return this.props.duration.time;
   }
   set duration(duration: Time) {
      this.props.duration = duration;
   }
   get price(): number {
      return this.props.price;
   }
   set price(price: number) {
      this.props.price = price;
   }
   get consultationPlaces(): AggregateID[] {
      return Array.from(this.props.consultationPlaces);
   }
   addConsultationPlace(...consultationPlaceIds: AggregateID[]) {
      consultationPlaceIds.forEach((consultationPlaceId: AggregateID) => {
         if (!this.props.consultationPlaces.has(consultationPlaceId)) this.props.consultationPlaces.add(consultationPlaceId);
      });
   }
   removeConsultationPlace(...consultationPlaceIds: AggregateID[]) {
      consultationPlaceIds.forEach((consultationPlaceId: AggregateID) => {
         if (this.props.consultationPlaces.has(consultationPlaceId)) this.props.consultationPlaces.delete(consultationPlaceId);
      });
   }
   validate() {
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom du service doit être fourni.");
      if (!Object.values(NutritionistServiceType).includes(this.props.type))
         throw new ArgumentOutOfRangeException("Le type de service est invalide.");
      if (!Object.values(NutritionistServicePatientType).includes(this.props.patientType))
         throw new ArgumentOutOfRangeException("Le type de patient est invalide.");
      if (!this.props.duration.isValid()) throw new ArgumentInvalidException("La durée n'est pas valide.");
      if (!Guard.isNegative(this.props.price)) throw new NegativeValueError("Le prix du service ne doit pas être négative.");
   }

   static create(createServiceProps: CreateServiceProps): Result<Service> {
      try {
         const time = Time.create(createServiceProps.duration);
         if (time.isFailure) throw new ObjectCreationError(String((time.err as any)?.message || time.err));
         const service = new Service({
            props: {
               name: createServiceProps.name,
               type: createServiceProps.type as NutritionistServiceType,
               patientType: createServiceProps.patientType as NutritionistServicePatientType,
               price: createServiceProps.price,
               consultationPlaces: new Set(createServiceProps.consultationPlaces),
               duration: time.val as Time,
            },
         });
         return Result.ok<Service>(service);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Service>(`[${e.code}]:${e.message}`)
            : Result.fail<Service>(`Erreur inattendue. ${Service.constructor.name}`);
      }
   }
}
