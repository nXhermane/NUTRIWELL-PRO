import { isArray, isDefined } from "./../helpers/types";
import getFn from "./../helpers/get";
import levenshteinDistance from "./../helpers/levenshteinDistance";
import BitapSearch, { BitapSearchOptions } from "./../bitap";

const Config = {
   ngramSize: 3,
   isCaseSensitive: false,
   threshold: 0.3,
   withBitap: true,
};

export interface DataTypeInside<T> {
   item: T;
   relevance: number;
}

export interface NGramOptions {
   ngramSize: number;
   keys?: string | string[];
   isCaseSensitive: boolean;
   threshold: number;
   withBitap: boolean;
   searchOption?: BitapSearchOptions;
}

export default class NGramIndex<T> {
   private index: Map<string, Set<number>>;
   private data: Map<number, DataTypeInside<T>>;
   private counter: number = 0;
   private _keys: string[] = [];
   private _defaultKey: string = "item";
   private _options: NGramOptions = Config;
   constructor(options?: Partial<NGramOptions>) {
      this.index = new Map();
      this.data = new Map();
      this.getUniqueId();
      this.initConfiguration(options);
   }

   private initConfiguration(options?: Partial<NGramOptions>) {
      if (isDefined(options)) {
         this._options = { ...this._options, ...options };
         this._keys = this.getKeys(this._options.keys);
      } else {
         this._keys = [this._defaultKey];
      }
   }

   private getKeys(keys?: string | string[]): string[] {
      if (isDefined(keys)) {
         return isArray(keys) ? (keys as string[]).map((key: string) => `${this._defaultKey}.${key}`) : [`${this._defaultKey}.${keys as string}`];
      } else {
         return [this._defaultKey];
      }
   }

   private generateNGrams(text: string): string[] {
      const ngrams: string[] = [];
      const { ngramSize } = this._options;
      for (let i = 0; i <= text.length - ngramSize; i++) {
         ngrams.push(text.slice(i, i + ngramSize));
      }
      return ngrams;
   }

   private sortResult(data: DataTypeInside<T>[]): DataTypeInside<T>[] {
      return data.sort((a: DataTypeInside<T>, b: DataTypeInside<T>) => b.relevance - a.relevance);
   }

   private areStringsDisimilar(relevance: number, maxLength: number): boolean {
      return relevance * 100 > Math.floor(maxLength * this._options.threshold);
   }

   private getUniqueId(): number {
      return this.counter++;
   }

   indexDoc(doc: T): void {
      const data: DataTypeInside<T> = {
         item: doc,
         relevance: 0,
      };
      const dataIndex = this.getUniqueId();
      for (const key of this._keys) {
         const text = getFn(data, key)! as string;
         const normalizedText = this._options.isCaseSensitive ? text.toLowerCase() : text;
         const ngrams = this.generateNGrams(normalizedText);
         for (const ngram of ngrams) {
            if (!this.index.has(ngram)) {
               this.index.set(ngram, new Set<number>());
            }
            this.index.get(ngram)!.add(dataIndex);
         }
      }
      this.data.set(dataIndex, data);
   }

   search(pattern: string, validate = (doc: DataTypeInside<T>) => true): DataTypeInside<T>[] {
      const normalizedPattern = this._options.isCaseSensitive ? pattern.toLowerCase() : pattern;
      const ngrams = this.generateNGrams(normalizedPattern);
      const results = new Map<number, DataTypeInside<T>>();
      const searcher = this._options.withBitap ? new BitapSearch(pattern, this._options?.searchOption) : null;
      for (const ngram of ngrams) {
         if (this.index.has(ngram)) {
            const entries = this.index.get(ngram)!;
            for (const dataIndex of entries) {
               const doc = this.data.get(dataIndex)!;

               const relevanceArray: number[] = [];
               const keyValueLength: number[] = [];
               let bitTapResult = null;

               for (const key of this._keys) {
                  const text = getFn(doc, key)! as string;
                  if (this._options.withBitap) {
                     const searcherResult = searcher?.searchIn(text);
                     bitTapResult = searcherResult?.isMatch ? searcherResult : null;
                  } else {
                     relevanceArray.push(1 / levenshteinDistance(pattern, text));
                     keyValueLength.push(text.length);
                  }
               }

               if (this._options.withBitap) {
                  if (bitTapResult != null && validate(doc)) {
                     results.set(dataIndex, {
                        ...doc,
                        relevance: 1 - bitTapResult.score,
                     });
                  }
               } else {
                  const relevance = Math.max(...relevanceArray);
                  const maxLength = Math.max(Math.min(...keyValueLength), pattern.length);
                  if (this.areStringsDisimilar(relevance, maxLength) && validate(doc)) {
                     results.set(dataIndex, { ...doc, relevance });
                  }
               }
            }
         }
      }

      return this.sortResult(Array.from(results.values()));
   }
   reset() {
      this.index = new Map();
      this.data = new Map();
      this.counter = 0;
   }

   toJSON(): { index: string; data: string } {
      const indexJSON = JSON.stringify(Array.from(this.index.entries()).map(([key, value]) => [key, Array.from(value)]));
      const dataJSON = JSON.stringify([...this.data]);
      return { index: JSON.parse(indexJSON), data: JSON.parse(dataJSON) };
   }
   static reconstructIndex<T>(indexData: any): Map<string, Set<number>> {
      return new Map<string, Set<number>>(indexData.map(([key, value]: [string, number[]]) => [key, new Set(value)]));
   }

   static reconstructData<T>(dataIndex: any): Map<number, DataTypeInside<T>> {
      return new Map<number, DataTypeInside<T>>(dataIndex);
   }

   reconstruct(params: { index: string; data: string }) {
      this.index = NGramIndex.reconstructIndex(JSON.parse(params.index));
      this.data = NGramIndex.reconstructData(JSON.parse(params.data));
   }
}
