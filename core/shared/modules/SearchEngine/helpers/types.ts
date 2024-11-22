export function isArray(value: any): boolean {
   return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
}

// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
const INFINITY = 1 / 0;
export function baseToString(value: any): string {
   // Exit early for strings to avoid a performance hit in some environments.
   if (typeof value == "string") {
      return value;
   }
   let result = value + "";
   return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}

export function toString(value: any): string {
   return value == null ? "" : baseToString(value);
}

export function isString(value: any): boolean {
   return typeof value === "string";
}

export function isNumber(value: any): boolean {
   return typeof value === "number";
}

// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
export function isBoolean(value: any): boolean {
   return value === true || value === false || (isObjectLike(value) && getTag(value) == "[object Boolean]");
}

export function isObject(value: any): boolean {
   return typeof value === "object";
}

// Checks if `value` is object-like.
export function isObjectLike(value: any): boolean {
   return isObject(value) && value !== null;
}

export function isDefined(value: any): boolean {
   return value !== undefined && value !== null;
}

export function isBlank(value: string): boolean {
   return !value.trim().length;
}

// Gets the `toStringTag` of `value`.
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
function getTag(value: any): string {
   return value == null ? (value === undefined ? "[object Undefined]" : "[object Null]") : Object.prototype.toString.call(value);
}
