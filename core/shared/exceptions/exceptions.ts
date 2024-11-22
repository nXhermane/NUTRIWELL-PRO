import {
   ARGUMENT_INVALID,
   ARGUMENT_NOT_PROVIDED,
   ARGUMENT_OUT_OF_RANGE,
   CONFLICT,
   INTERNAL_SERVER_ERROR,
   NOT_FOUND,
   AUTHORIZATION_ERROR,
   CREATION_FAILED,
   INVALID_RESULT,
} from "./exception.code";
import { ExceptionBase } from "./exception.base";

/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
   readonly code = ARGUMENT_INVALID;
}

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 *
 * @class ArgumentNotProvidedException
 * @extends {ExceptionBase}
 */
export class ArgumentNotProvidedException extends ExceptionBase {
   readonly code = ARGUMENT_NOT_PROVIDED;
}

/**
 * Used to indicate that an argument is out of allowed range
 * (for example: incorrect string/array length, number not in allowed min/max range etc)
 *
 * @class ArgumentOutOfRangeException
 * @extends {ExceptionBase}
 */
export class ArgumentOutOfRangeException extends ExceptionBase {
   readonly code = ARGUMENT_OUT_OF_RANGE;
}

/**
 * Used to indicate conflicting entities (usually in the database)
 *
 * @class ConflictException
 * @extends {ExceptionBase}
 */
export class ConflictException extends ExceptionBase {
   readonly code = CONFLICT;
}

/**
 * Used to indicate that entity is not found
 *
 * @class NotFoundException
 * @extends {ExceptionBase}
 */
export class NotFoundException extends ExceptionBase {
   static readonly message = "Not found";

   constructor(message = NotFoundException.message) {
      super(message);
   }

   readonly code = NOT_FOUND;
}

/**
 * Used to indicate an internal server error that does not fall under all other errors
 *
 * @class InternalServerErrorException
 * @extends {ExceptionBase}
 */
export class InternalServerErrorException extends ExceptionBase {
   static readonly message = "Internal server error";

   constructor(message = InternalServerErrorException.message) {
      super(message);
   }

   readonly code = INTERNAL_SERVER_ERROR;
}

export class EmptyStringError extends ExceptionBase {
   static readonly message = "Property cannot be empty";
   constructor(message = EmptyStringError.message) {
      super(message);
   }
   readonly code = ARGUMENT_NOT_PROVIDED;
}
export class NegativeValueError extends ExceptionBase {
   static readonly message = "Property cannot be negative";
   constructor(message = NegativeValueError.message) {
      super(message);
   }
   readonly code = ARGUMENT_INVALID;
}
export class DuplicateValueError extends ExceptionBase {
   static readonly message = "Property values cannot be duplicated";
   constructor(message = DuplicateValueError.message) {
      super(message);
   }
   readonly code = ARGUMENT_INVALID;
}
export class AuthValueError extends ExceptionBase {
   static readonly message = "Property value is not authorized";
   constructor(message = AuthValueError.message) {
      super(message);
   }
   readonly code = AUTHORIZATION_ERROR;
}
export class InvalidArgumentFormatError extends ExceptionBase {
   static readonly message = "Property value cannot not be in this format";
   constructor(message = InvalidArgumentFormatError.message) {
      super(message);
   }
   readonly code = ARGUMENT_INVALID;
}
export class InvalidReference extends ExceptionBase {
   static readonly message = "Property reference is invalid";
   constructor(msg = InvalidReference.message) {
      super(msg);
   }
   readonly code = ARGUMENT_INVALID;
}
export class ObjectCreationError extends ExceptionBase {
   static readonly message = "Failed to create the object";
   constructor(msg = ObjectCreationError.message) {
      super(msg);
   }
   readonly code = CREATION_FAILED;
}
export class InvalidResultError extends ExceptionBase {
   static readonly message = "The process returned an invalid result"
   constructor(msg = InvalidResultError.message) {
      super(msg);
   }
   readonly code = INVALID_RESULT
}
