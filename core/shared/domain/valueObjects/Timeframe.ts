import { ValueObject } from "./../ValueObject";
import { Guard, Result } from "./../../core";
import { ArgumentNotProvidedException, ArgumentInvalidException, ExceptionBase } from "../../exceptions";
import { CDate } from "./Date";

export interface ITimeframe {
   start: CDate;
   end: CDate;
}
export class Timeframe extends ValueObject<ITimeframe> {
   constructor(props: ITimeframe) {
      super(props);
   }
   validate(props: ITimeframe): void {
      if (Guard.isEmpty(props.start).succeeded || Guard.isEmpty(props.end).succeeded)
         throw new ArgumentNotProvidedException("La date de debut et la date de fin doit etre fournir.");

      if (!props.start.isBefore(props.end)) throw new ArgumentInvalidException("La date de début doit etre inferieur a la date de fin ou égale");
   }

   get isExpire(): boolean {
      const date = new CDate();
      return date.isAfter(date);
   }

   static create(props: ITimeframe): Result<Timeframe> {
      try {
         const timeframe = new Timeframe(props);
         return Result.ok<Timeframe>(timeframe);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Timeframe>(`[${e.code}]:${e.message}`)
            : Result.fail<Timeframe>(`Unexpected Error. ${Timeframe?.constructor.name}`);
      }
   }
}
