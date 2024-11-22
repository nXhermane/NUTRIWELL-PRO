import { Guard } from "./../core";
import { convertPropsToObject } from "./../utils";
import { ArgumentNotProvidedException } from "./../exceptions/exceptions";
/**
 * Domain Primitive is an object that contains only a single value
 */
export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
   value: T;
}

export type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
   protected readonly props: ValueObjectProps<T>;

   constructor(props: ValueObjectProps<T>) {
      this.checkIfEmpty(props);
      this.validate(props);
      this.props = props;
   }

   protected abstract validate(props: ValueObjectProps<T>): void;

   static isValueObject(obj: unknown): obj is ValueObject<unknown> {
      return obj instanceof ValueObject;
   }

   /**
    *  Check if two Value Objects are equal. Checks structural equality.
    * @param vo ValueObject
    */
   public equals(vo?: ValueObject<T>): boolean {
      if (vo === null || vo === undefined) {
         return false;
      }
      return JSON.stringify(this) === JSON.stringify(vo);
   }
   /**
    * Unpack a value object to get its raw properties
    */
   public unpack(): T {
      if (this.isDomainPrimitive(this.props)) {
         return this.props.value;
      }

      const propsCopy = convertPropsToObject(ValueObject, this.props);

      return Object.freeze(propsCopy);
   }

   private checkIfEmpty(props: ValueObjectProps<T>): void {
      if (Guard.isEmpty(props).succeeded || (this.isDomainPrimitive(props) && Guard.isEmpty(props.value).succeeded)) {
         throw new ArgumentNotProvidedException("Property cannot be empty");
      }
   }

   private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & (Primitives | Date)> {
      if (Object.prototype.hasOwnProperty.call(obj, "value")) {
         return true;
      }
      return false;
   }
   public isValid(): boolean {
      try {
         this.validate(this.props);
         return true;
      } catch (e) {
         return false;
      }
   }
}
