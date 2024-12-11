import { PathResolver } from "smart-path-resolver";

export class EvaluatePath {
   static getPathResolver<T = any>(rootObject: { [key: string]: any }): PathResolver<T> {
      return new PathResolver(rootObject);
   }
}
