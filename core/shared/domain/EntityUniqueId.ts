import { Identifier } from "./Identifier";
import { randomUUID } from "./../utils";
export class EntityUniqueID extends Identifier<string | number> {
   constructor(id?: string | number) {
      super(id ? id : randomUUID());
   }
}
