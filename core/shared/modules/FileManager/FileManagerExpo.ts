import { FileManager, FileData } from "./FileManager";
import * as FileSystem from "expo-file-system";
import { File } from "./ValueObjects/File";
import { Image } from "./ValueObjects/Image";
export class FileManagerExpo implements FileManager {
   private defaultDir = FileSystem.documentDirectory;

   async save(fileData: FileData): Promise<File> {
      const dir = this.defaultDir + (fileData?.dirname ? fileData.dirname : "").trim();
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
         await FileSystem.makeDirectoryAsync(dir);
      }
      const fileName = `${Date.now()}-${fileData.file.name}.${fileData.file.type}`;
      const fileUri = `${dir}/${fileName}`;
      if (fileData.file.isExternalResource()) await FileSystem.downloadAsync(fileData.file.uri, fileUri);
      else await FileSystem.copyAsync({ from: fileData.file.uri, to: fileUri });
      return fileData.file.name === "image" ? new Image(fileUri) : new File({ uri: fileUri, name: fileData.file.name });
   }

   async delete(uri: string): Promise<void> {
      await FileSystem.deleteAsync(uri);
   }
}
