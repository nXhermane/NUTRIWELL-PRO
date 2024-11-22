import { File } from "./ValueObjects/File";
export interface FileData {
   file: File;
   dirname?: string;
}
export interface FileManager {
   save(fileData: FileData): Promise<File>;
   delete(uri: string): Promise<void>;
}
