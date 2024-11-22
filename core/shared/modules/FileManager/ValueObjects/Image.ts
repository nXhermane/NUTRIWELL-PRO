import { File } from "./File";
export enum ImageType {
   JPG = "jpg",
   PNG = "png",
   WEBP = "webp",
   GIF = "gif",
}
export class Image extends File {
   constructor(uri: string) {
      super({ uri: uri, name: "image" });
   }
   isInternalResource(uri: string = this.props.uri): boolean {
      const isInternal = super.isInternalResource(uri);
      if (isInternal) {
         const uriArr = uri.split(".");
         if (Object.values(ImageType).includes(uriArr[uriArr.length - 1].trim().toLowerCase() as ImageType)) return true;
      }
      return false;
   }
}
