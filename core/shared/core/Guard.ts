export interface IGuardResult {
   succeeded: boolean;
   message?: string;
}

export interface IGuardArgument {
   argument: any;
   argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
   /**
    * Checks if value is empty. Accepts strings, numbers, booleans, objects and arrays.
    */
   static isEmpty(value: unknown, argumentName: string = ""): IGuardResult {
      if (typeof value === "number" || typeof value === "boolean") {
         return { succeeded: false };
      }
      if (typeof value === "undefined" || value === null) {
         return { succeeded: true, message: `The value ${argumentName} is null or undefined` };
      }
      if (value instanceof Date) {
         return { succeeded: false };
      }
      if (value instanceof Object && !Object.keys(value).length) {
         return { succeeded: true, message: `The object ${argumentName} is empty` };
      }
      if (Array.isArray(value)) {
         if (value.length === 0) {
            return { succeeded: true, message: `The array ${argumentName} is empty` };
         }
         if (value.every((item) => Guard.isEmpty(item))) {
            return { succeeded: true, message: `One of the values of the table ${argumentName} is empty or undfined or null` };
         }
      }
      if ((value as string).trim() === "") {
         return { succeeded: true, message: `The string ${argumentName} is empty.` };
      }

      return { succeeded: false };
   }
   static isNegative(num: number): IGuardResult {
      if (num < 0) return { succeeded: true, message: `this value is negative` };
      return { succeeded: false, message: "this value is not negative" };
   }
   public static combine(guardResults: IGuardResult[]): IGuardResult {
      for (let result of guardResults) {
         if (result.succeeded === false) return result;
      }

      return { succeeded: true };
   }

   public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
      if (argument === null || argument === undefined) {
         return { succeeded: false, message: `${argumentName} is null or undefined` };
      } else {
         return { succeeded: true };
      }
   }

   public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
      for (let arg of args) {
         const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
         if (!result.succeeded) return result;
      }

      return { succeeded: true };
   }

   public static isOneOf(value: any, validValues: any[], argumentName: string): IGuardResult {
      let isValid = false;
      for (const validValue of validValues) {
         if (value === validValue) {
            isValid = true;
         }
      }

      if (isValid) {
         return { succeeded: true };
      } else {
         return {
            succeeded: false,
            message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
         };
      }
   }

   public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
      const isInRange = num >= min && num <= max;
      if (!isInRange) {
         return { succeeded: false, message: `${argumentName} is not within range ${min} to ${max}.` };
      } else {
         return { succeeded: true };
      }
   }

   public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
      let failingResult: IGuardResult = null as unknown as IGuardResult;
      for (let num of numbers) {
         const numIsInRangeResult = this.inRange(num, min, max, argumentName);
         if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
      }

      if (failingResult) {
         return { succeeded: false, message: `${argumentName} is not within the range.` };
      } else {
         return { succeeded: true };
      }
   }
   public static isString(value: any): IGuardResult {
      const isString = typeof value === "string";
      return isString ? { succeeded: true } : { succeeded: false };
   }
   public static isNumber(value: any): IGuardResult {
      const isNumber = typeof value === "number";
      return isNumber ? { succeeded: true } : { succeeded: false };
   }
}
