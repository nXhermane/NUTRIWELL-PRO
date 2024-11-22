import { ValueObject, RegistrationDate, Guard, EmptyStringError, DateManager, ExceptionBase, Result } from "@shared";
import { CreateEatingBehaviorProps } from "./../types";
export interface IEatingBehavior {
   date: RegistrationDate;
   eatingBehavior: string;
}

export class EatingBehavior extends ValueObject<IEatingBehavior> {
   get eatingBehavior(): string {
      return this.props.eatingBehavior;
   }
   get date(): string {
      return this.props.date.toString();
   }
   validate(props: IEatingBehavior): void {
      if (Guard.isEmpty(props.eatingBehavior).succeeded) throw new EmptyStringError();
   }
   static create(eatingBehavior: CreateEatingBehaviorProps): Result<EatingBehavior> {
      try {
         const newEatingBehavior = new EatingBehavior({
            date: new RegistrationDate(DateManager.formatDate(eatingBehavior.date)),
            eatingBehavior: eatingBehavior.eatingBehavior,
         });
         return Result.ok<EatingBehavior>(newEatingBehavior);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<EatingBehavior>(`[${e.code}]:${e.message}`)
            : Result.fail<EatingBehavior>(`Erreur inattendue. ${EatingBehavior.constructor.name}`);
      }
   }
}
