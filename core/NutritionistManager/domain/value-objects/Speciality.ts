import { ValueObject, AggregateID, Guard, EmptyStringError, Result, ExceptionBase } from "@shared";

export interface ISpeciality {
   name: string;
   description?: string;
}

export class Speciality extends ValueObject<ISpeciality> {
   validate(props: ISpeciality): void {
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("Le nom de la specialité doit être fourni.");
   }

   static create(props: ISpeciality): Result<Speciality> {
      try {
         const speciality = new Speciality(props);
         return Result.ok<Speciality>(speciality);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Speciality>(`[${e.code}]:${e.message}`)
            : Result.fail<Speciality>(`Erreur inattendue. ${Speciality.constructor.name}`);
      }
   }
}
