import { EntityUniqueID } from "./EntityUniqueId";
import { DateManager, convertPropsToObject } from "../utils";
import { Guard } from "./../core";
import { ValueObject } from "./ValueObject";
export type AggregateID = string | number;

export interface BaseEntityProps {
   id: AggregateID;
   createdAt: string;
   updatedAt: string;
}
export interface CreateEntityProps<T> {
   id?: AggregateID;
   props: T;
   createdAt?: string;
   updatedAt?: string;
}
// Entity Class Base
export abstract class Entity<EntityProps> {
   private readonly _id: EntityUniqueID;
   private readonly _createdAt: string;
   private _updatedAt: string;
   protected _isValid: boolean = false;
   protected _isDeleted: boolean = false;
   public readonly props: EntityProps;
   constructor({ createdAt, updatedAt, id, props }: CreateEntityProps<EntityProps>) {
      this._id = new EntityUniqueID(id);
      this.validateProps(props);
      const now = DateManager.dateToTimestamps(DateManager.date);
      this._createdAt = createdAt || now;
      this._updatedAt = updatedAt || now;
      this.props = props;
      this?.validate();
   }
   get id(): AggregateID {
      return this._id.toValue();
   }
   get createdAt(): string {
      return this._createdAt;
   }
   get updatedAt(): string {
      return this._updatedAt;
   }

   /**
    * Returns entity properties.
    * @return {*}  {Props & EntityProps}
    * @memberof Entity
    */
   public getProps(): EntityProps & BaseEntityProps {
      const propsCopy = {
         id: this.id,
         createdAt: this.createdAt,
         updatedAt: this.updatedAt,
         ...this.props,
      };
      return Object.freeze(propsCopy);
   }
   /**
    * Convert an Entity and all sub-entities/Value Objects it
    * contains to a plain object with primitive types. Can be
    * useful when logging an entity during testing/debugging
    */
   public toObject(): unknown {
      const plainProps = convertPropsToObject(ValueObject, this.props);

      const result = {
         id: this._id,
         createdAt: this._createdAt,
         updatedAt: this._updatedAt,
         ...plainProps,
      };
      return Object.freeze(result);
   }
   // Verify if is an Entity Object
   static isEntity = (object: any): object is Entity<any> => {
      return object instanceof Entity;
   };
   /**
    *  Checks if two entities are the same Entity by comparing ID field.
    * @param object Entity
    */
   public equals(object?: Entity<EntityProps>): boolean {
      if (object == null || object == undefined) {
         return false;
      }

      if (this === object) {
         return true;
      }

      if (!Entity.isEntity(object)) {
         return false;
      }

      return this._id.equals(object._id);
   }
   /**
    * There are certain rules that always have to be true (invariants)
    * for each entity. Validate method is called every time before
    * saving an entity to the database to make sure those rules are respected.
    */
   public abstract validate(): void;

   private validateProps(props: EntityProps): void {
      const MAX_PROPS = 50;

      if (Guard.isEmpty(props).succeeded) {
         throw new Error("Entity props should not be empty");
      }
      if (typeof props !== "object") {
         throw new Error("Entity props should be an object");
      }
      if (Object.keys(props as any).length > MAX_PROPS) {
         throw new Error(`Entity props should not have more than ${MAX_PROPS} properties`);
      }
   }
   public isValid(): boolean {
      try {
         this?.validate();
         return this._isValid;
      } catch (e) {
         return this._isValid;
      }
   }
   get isDeleted(): boolean {
      return this._isDeleted;
   }
   public delete(): void {
      this._isDeleted = true;
   }
}
