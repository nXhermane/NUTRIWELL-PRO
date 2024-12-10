import { Guard, Result } from "../../core";
import { EmptyStringError, ExceptionBase } from "../../exceptions";
import { ValueObject, DomainPrimitive } from "../ValueObject";

export class ProtocolName extends ValueObject<string> {
   toString(): string {
      return this.props.value;
   }
   protected validate(props: DomainPrimitive<string>): void {
      if (Guard.isEmpty(props.value)) throw new EmptyStringError("Le nom du protole ne doit être vide.");
   }
   static create(): Result<ProtocolName> {
      try {
         const protocolName = new ProtocolName({ value: "PROTOCOL" });
         return Result.ok<ProtocolName>(protocolName);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<ProtocolName>(`[${error.code}]:${error.message}`)
            : Result.fail<ProtocolName>(`Erreur inattendue. ${ProtocolName?.constructor.name}`);
      }
   }
}
