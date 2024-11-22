export interface SerializedException {
   message: string;
   stack?: string;
   cause?: string;
   metadata?: unknown;
}

export abstract class ExceptionBase extends Error {
   abstract code: string;
   constructor(
      readonly message: string,
      readonly cause?: Error,
      readonly metadata?: unknown,
   ) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
   }

   toSerialized(): SerializedException {
      return {
         cause: JSON.stringify(this.cause),
         message: this.message,
         metadata: this.metadata,
         stack: this.stack,
      };
   }
   toJSON(): string {
      return JSON.stringify(this.toSerialized());
   }
}
