import { ValueObject } from "./../../../domain";
import { ArgumentInvalidException } from "./../../../exceptions";

export interface IFile {
   uri: string;
   name: string;
}
export class File extends ValueObject<IFile> {
   constructor(file: IFile) {
      super(file);
   }
   protected validate(props: IFile): void {
      if (!this.isExternalResource(props.uri) && !this.isInternalResource(props.uri)) throw new ArgumentInvalidException("l'uri n'est pas valide.");
   }
   isExternalResource(uri: string = this.props.uri): boolean {
      return uri.includes("http://") || uri.includes("https://") ? true : false;
   }
   isInternalResource(uri: string = this.props.uri): boolean {
      return uri.includes("file://") || uri.includes("content://") || uri.includes("asset://") ? true : false;
   }
   get uri(): string {
      return this.props.uri;
   }
   get type(): string {
      const uriArr = this.props.uri.split(".");
      return uriArr[uriArr.length - 1]?.trim().toLowerCase();
   }
   get name(): string {
      return this.props.name;
   }
}
