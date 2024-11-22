import { Value } from "./trie";

import { isDefined } from "./helpers/types";
import NGramIndex, { NGramOptions, DataTypeInside } from "./compressedNGram/NGramIndex";
export interface SearchEngineResult<T> extends DataTypeInside<T> {}
export interface SearchEngineOptions extends Partial<NGramOptions> {}
export interface ISearchEngine<T> {
   setDocs(list: T[]): void;
   addDoc(doc: T): void;
   search(pattern: string, validate?: (doc: SearchEngineResult<T>) => boolean): SearchEngineResult<T>[];
   reset(): void;
   toJSON(): string;
   reconstruct(searchEngineData: string): boolean;
}
export class SearchEngine<T extends Value = Value> implements ISearchEngine<T> {
   private options: SearchEngineOptions = {};
   private nGramIndex: NGramIndex<T>;
   constructor(list: T[] = [], options: SearchEngineOptions = {}) {
      this.options = { ...this.options, ...options };
      this.nGramIndex = new NGramIndex<T>(this.options);
      this.init(list);
   }
   private init(list: T[]) {
      this.nGramIndex = new NGramIndex<T>(this.options);
      for (const item of list) {
         this.nGramIndex.indexDoc(item);
      }
   }
   setDocs(list: T[]) {
      if (!isDefined(list)) return;
      this.init(list);
   }
   addDoc(item: T) {
      if (!isDefined(item)) return;
      this.nGramIndex.indexDoc(item);
   }
   search(pattern: string, validate = (_doc: SearchEngineResult<T>) => true): SearchEngineResult<T>[] {
      return this.nGramIndex.search(pattern, validate);
   }
   reset() {
      this.nGramIndex.reset();
   }
   toJSON(): string {
      return JSON.stringify(this.nGramIndex.toJSON());
   }
   reconstruct(searchEngineData: string): boolean {
      try {
         if (searchEngineData === undefined) throw new Error("Can not be reconstruct searchEngine with undefined value");
         this.nGramIndex.reconstruct(JSON.parse(searchEngineData) as { index: string; data: string });
         return true;
      } catch (e) {
         return false;
      }
   }
}
