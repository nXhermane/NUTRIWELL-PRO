import {
   Entity,
   CreateEntityProps,
   BaseEntityProps,
   Guard,
   ArgumentInvalidException,
   Result,
   ExceptionBase,
   Address,
   IAddress,
   EmptyStringError,
   ObjectCreationError,
} from "@shared";
import { CreateConsultationPlaceProps } from "./../types";
export interface IConsultationPlace {
   name: string;
   address: Address;
   isOnline: boolean;
   isPublic: boolean;
}

export class ConsultationPlace extends Entity<IConsultationPlace> {
   constructor(createProps: CreateEntityProps<IConsultationPlace>) {
      super(createProps);
   }
   get name(): string {
      return this.props.name;
   }
   set name(name: string) {
      this.props.name = name;
   }
   get address(): IAddress {
      return this.props.address.unpack();
   }
   set address(address: Address) {
      this.props.address = address;
   }
   get isOnline(): boolean {
      return this.props.isOnline;
   }
   set isOnline(isOnline: boolean) {
      this.props.isOnline = isOnline;
   }
   get isPublic(): boolean {
      return this.props.isPublic;
   }
   set isPublic(isPublic: boolean) {
      this.props.isPublic = isPublic;
   }
   validate(): void {
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom du lieux de consultion doit etre fournir");
   }
   static create(consultationPlaceProps: CreateConsultationPlaceProps): Result<ConsultationPlace> {
      try {
         const address = Address.create(consultationPlaceProps.address);
         if (address.isFailure) throw new ObjectCreationError(String((address.err as any)?.message || address.err));

         const consultationPlace = new ConsultationPlace({
            props: {
               isPublic: consultationPlaceProps.isPublic,
               isOnline: consultationPlaceProps.isOnline,
               name: consultationPlaceProps.name,
               address: address.val,
            },
         });
         return Result.ok<ConsultationPlace>(consultationPlace);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<ConsultationPlace>(`[${e.code}]:${e.message}`)
            : Result.fail<ConsultationPlace>(`Erreur inattendue. ${ConsultationPlace.constructor.name}`);
      }
   }
}
