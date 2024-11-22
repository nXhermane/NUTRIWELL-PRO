export class Result<T> {
   public isSuccess: boolean;
   public isFailure: boolean;
   private error: T | string;
   private _value: T;

   constructor(isSuccess: boolean, error?: T | string, value?: T) {
      if (isSuccess && error) {
         throw new Error("InvalidOperation: A result cannot be successful and contain an error");
      }
      if (!isSuccess && !error) {
         throw new Error("InvalidOperation: A failing result needs to contain an error message");
      }

      this.isSuccess = isSuccess;
      this.isFailure = !isSuccess;
      this.error = error || "";
      this._value = value!!;
      Object.freeze(this);
   }

   public get val(): T {
      if (!this.isSuccess) {
         console.log(this.error);
         throw new Error("Can't get the value of an error result. Use 'errorValue' instead.");
      }

      return this._value;
   }

   public get err(): T {
      return this.error as T;
   }

   public static ok<U>(value?: U): Result<U> {
      return new Result<U>(true, undefined, value);
   }

   public static fail<U>(error: string): Result<U> {
      return new Result<U>(false, error);
   }

   public static combine(results: Result<any>[]): Result<any> {
      for (let result of results) {
         if (result.isFailure) return result;
      }
      return Result.ok();
   }
   public static encapsulate<U>(func: () => U): Result<U> {
      try {
         const result = func();
         return Result.ok<U>(result);
      } catch (e: any) {
         return Result.fail<U>(e as any);
      }
   }
   public static async encapsulateAsync<U>(func: () => Promise<U>): Promise<Result<U>> {
      try {
         const result = await func();
         return Result.ok<U>(result);
      } catch (e: any) {
         return Result.fail<U>(e as any);
      }
   }
   
}

export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
   readonly value: L;

   constructor(value: L) {
      this.value = value;
   }

   isLeft(): this is Left<L, A> {
      return true;
   }

   isRight(): this is Right<L, A> {
      return false;
   }
}

export class Right<L, A> {
   readonly value: A;

   constructor(value: A) {
      this.value = value;
   }

   isLeft(): this is Left<L, A> {
      return false;
   }

   isRight(): this is Right<L, A> {
      return true;
   }
}

export const left = <L, A>(l: L): Either<L, A> => {
   return new Left<L, A>(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
   return new Right<L, A>(a);
};
