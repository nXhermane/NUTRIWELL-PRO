import { isDefined, isString, isNumber, isBoolean, isArray, toString } from "./types";

export default function get(obj: any, path: string | string[]): any {
   let list: any[] = [];
   let arr: boolean = false;

   const deepGet = (obj: any, path: string[], index: number) => {
      if (!isDefined(obj)) {
         return;
      }
      if (!path[index]) {
         // If there's no path left, we've arrived at the object we care about.
         list.push(obj);
      } else {
         let key = path[index];

         const value = obj[key];

         if (!isDefined(value)) {
            return;
         }

         // If we're at the last value in the path, and if it's a string/number/bool,
         // add it to the list
         if (index === path.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
            list.push(toString(value));
         } else if (isArray(value)) {
            arr = true;
            // Search each item in the array.
            for (let i = 0, len = value.length; i < len; i += 1) {
               deepGet(value[i], path, index + 1);
            }
         } else if (path.length) {
            // An object. Recurse further.
            deepGet(value, path, index + 1);
         }
      }
   };
   let pathArray: string[] = [];
   if (isString(path)) {
      pathArray = (path as string).split(".");
   } else {
      pathArray = path as string[];
   }
   // Backwards compatibility (since path used to be a string)
   deepGet(obj, pathArray, 0);

   return arr ? list : list[0];
}
