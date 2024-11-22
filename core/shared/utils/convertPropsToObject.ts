import { Entity } from "./../domain/Entity";
//import {ValueObject} from './../domain/ValueObject'
function isEntity(value_object: any, obj: unknown): obj is Entity<unknown> {
   /**
    * 'instanceof Entity' causes error here for some reason.
    * Probably creates some circular dependency. This is a workaround
    * until I find a solution :)
    */
   return (
      Object.prototype.hasOwnProperty.call(obj, "toObject") &&
      Object.prototype.hasOwnProperty.call(obj, "id") &&
      value_object.isValueObject((obj as Entity<unknown>).id)
   );
}

function convertToPlainObject(value_object: any, item: any): any {
   if (value_object.isValueObject(item)) {
      return item.unpack();
   }
   if (isEntity(value_object, item)) {
      return item.toObject();
   }
   return item;
}

export function convertPropsToObject(value_object: any, props: any): any {
   const propsCopy = structuredClone(props);

   // eslint-disable-next-line guard-for-in
   for (const prop in propsCopy) {
      if (Array.isArray(propsCopy[prop])) {
         propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
            return convertToPlainObject(value_object, item);
         });
      }
      propsCopy[prop] = convertToPlainObject(value_object, propsCopy[prop]);
   }

   return propsCopy;
}
