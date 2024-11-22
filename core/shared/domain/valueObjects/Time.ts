import { ValueObject } from "./../ValueObject";
import { Guard, Result } from "./../../core";
import {
   ArgumentNotProvidedException,
   InvalidArgumentFormatError,
   ArgumentOutOfRangeException,
   ArgumentInvalidException,
   ExceptionBase,
} from "../../exceptions";

export class Time extends ValueObject<string> {
   constructor(time: string) {
      super({ value: time });
   }

   protected validate(props: { value: string }): void {
      if (Guard.isEmpty(props.value).succeeded) {
         throw new ArgumentNotProvidedException("L'heure ne peut pas être vide.");
      }

      // Expression régulière pour le format d'heure supporté
      const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;

      if (!timeRegex.test(props.value)) {
         throw new InvalidArgumentFormatError("Format d'heure invalide. Utilisez le format HH:mm.");
      }

      const [hours, minutes] = props.value.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
         throw new ArgumentInvalidException("Heure invalide. Assurez-vous que les heures et les minutes sont des nombres valides.");
      }

      if (hours < 0 || hours > 23) {
         throw new ArgumentOutOfRangeException("Heures invalides. Utilisez des valeurs entre 0 et 23.");
      }

      if (minutes < 0 || minutes > 59) {
         throw new ArgumentOutOfRangeException("Minutes invalides. Utilisez des valeurs entre 0 et 59.");
      }
   }

   public addHours(hours: number): Time {
      const currentTime = new Date(`2000-01-01T${this.props.value}`);
      currentTime.setHours(currentTime.getHours() + hours);
      const newTime = this.formatTime(currentTime);
      return new Time(newTime);
   }

   public addMinutes(minutes: number): Time {
      const currentTime = new Date(`2000-01-01T${this.props.value}`);
      currentTime.setMinutes(currentTime.getMinutes() + minutes);
      const newTime = this.formatTime(currentTime);
      return new Time(newTime);
   }

   get time(): string {
      return this.props.value;
   }
   public isBefore(time: Time): boolean {
      const thisTime = new Date(`2000-01-01T${this.props.value}`);
      const otherTime = new Date(`2000-01-01T${time.time}`);
      return thisTime < otherTime;
   }
   public isAfter(time: Time): boolean {
      const thisTime = new Date(`2000-01-01T${this.props.value}`);
      const otherTime = new Date(`2000-01-01T${time.time}`);
      return thisTime > otherTime;
   }

   private formatTime(date: Date): string {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
   }

   static create(props: string): Result<Time> {
      try {
         const time = new Time(props);
         return Result.ok<Time>(time);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<Time>(`[${e.code}]:${e.message}`)
            : Result.fail<Time>(`Unexpected Error. ${Time?.constructor.name}`);
      }
   }
}
