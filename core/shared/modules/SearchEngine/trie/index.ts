import TrieNode from "./trieNode";
import BitapSearch, { BitapSearchOptions } from "./../bitap";
import getFn from "./../helpers/get";
import { isArray, isString, isDefined } from "./../helpers/types";
export type Value =
   | {
        [key: string]: any;
     }
   | string;

export interface TrieNodeValue<T> {
   item: T;
}
export interface TrieResultValue<T> extends TrieNodeValue<T> {
   score: number;
}
export interface TrieOptions {
   keys?: string | string[];
   prefixSearch?: boolean;
   searchOption?: BitapSearchOptions;
}

export default class Trie<T extends Value> {
   private root: TrieNode<number>;
   private options: TrieOptions = {
      prefixSearch: false,
   } as TrieOptions;
   private keys: string[] = [];
   private readonly defaultKey: string = "item";
   private data: Map<number, TrieNodeValue<T>> = new Map();
   private idCounter: number = 0;
   private resultId: Set<number> = new Set();
   private counter = 0;
   constructor(options?: TrieOptions) {
      this.root = new TrieNode<number>();
      this.init(options);
   }
   private init(options?: TrieOptions) {
      if (isDefined(options)) {
         this.options = { ...this.options, ...options } as TrieOptions;
         if (isDefined(this.options?.keys)) {
            if (isArray(this.options.keys)) {
               this.keys = (this.options.keys! as string[]).map((key: string) => this.defaultKey + "." + key);
            }
            if (isString(this.options.keys)) {
               this.keys.push((this.defaultKey + "." + this.options.keys!) as string);
            }
         } else {
            this.keys.push(this.defaultKey);
         }
      } else {
      }
   }

   insert(value: T): void {
      const { prefixSearch } = this.options;
      const trieNodeValue = {
         item: value,
      };
      let node: TrieNode<number> = this.root;
      this.idCounter++;
      if (prefixSearch) {
         for (const key of this.keys) {
            const normalizedText = (getFn(trieNodeValue, key) as string).toLowerCase();
            for (const char of normalizedText) {
               if (!node.children.has(char)) {
                  node.children.set(char, new TrieNode<number>());
               }
               node = node.children.get(char) as TrieNode<number>;
            }
            node.isEndOfText = true;
            node.setValue(this.idCounter);
         }
      } else {
         const normalizedText = (getFn(trieNodeValue, this.keys[0]) as string).toLowerCase();
         for (const char of normalizedText.split(" ")) {
            if (!node.children.has(char)) {
               node.children.set(char, new TrieNode<number>());
            }
            node = node.children.get(char) as TrieNode<number>;
         }
         node.isEndOfText = true;
         node.setValue(this.idCounter);
      }

      this.data.set(this.idCounter, trieNodeValue);
   }

   search(pattern: string, validate = (value: TrieResultValue<T>) => true): TrieResultValue<T>[] {
      const normalizedPattern = pattern.toLowerCase();
      let node: TrieNode<number> = this.root;
      let results: TrieResultValue<T>[] = [];
      for (const char of normalizedPattern) {
         if (!node.children.has(char)) {
            return results;
         }
         node = node.children.get(char) as TrieNode<number>;
      }
      this.collectValueRecursiveInTrie(node, results, validate);
      this.resultId = new Set();
      return results;
   }
   private collectValueRecursiveInTrie(node: TrieNode<number>, results: TrieResultValue<T>[], validate: (value: TrieResultValue<T>) => boolean) {
      if (node.isEndOfText) {
         const nodeId = node.getValue()!;
         if (!this.resultId.has(nodeId)) {
            const value = { ...this.data.get(nodeId)!, score: 0 };
            if (validate(value)) {
               results.push(value);
               this.resultId.add(nodeId);
            }
         }
      }
      for (const [char, child] of node.children) {
         this.collectValueRecursiveInTrie(child, results, validate);
      }
   }
   searchFuzzi(pattern: string, validate = (value: TrieResultValue<T>) => true): TrieResultValue<T>[] {
      const normalizedPattern = pattern.toLowerCase();
      const fuzziResults: TrieResultValue<T>[] = [];
      const start = Date.now();
      const searcher = new BitapSearch(pattern, this.options?.searchOption);
      this.collectFuzziValueRecursiveInTrie(this.root, "", normalizedPattern, fuzziResults, searcher, validate);
      this.resultId = new Set();
      this.counter = 0;
      return fuzziResults;
   }

   private collectFuzziValueRecursiveInTrie(
      node: TrieNode<number>,
      currentText: string,
      normalizedPattern: string,
      fuzziResults: TrieResultValue<T>[],
      searcher: BitapSearch,
      validate: (value: TrieResultValue<T>) => boolean,
   ) {
      if (!node) return;
      if (node.isEndOfText) {
         const nodeId = node.getValue()!;
         if (!this.resultId.has(nodeId)) {
            const value = this.data.get(nodeId)!;
            const results: any[] = [];
            const start = Date.now();
            for (const key of this.keys) {
               const text = getFn(value, key);
               const result = searcher.searchIn(text);
               results.push(result);
            }
            if (results.some((result) => result.isMatch)) {
               const minResultScore = results.reduce(
                  (minScore, currentScore) => (currentScore.score < minScore.score ? currentScore : minScore),
                  results[0],
               );
               const result = {
                  ...value,
                  score: minResultScore.score,
               };
               const isValide = validate(result);
               if (isValide) {
                  fuzziResults.push(result);
                  this.resultId.add(nodeId);
               }
            }
         }
      }
      for (const [char, child] of node.children) {
         this.collectFuzziValueRecursiveInTrie(child, currentText + char, normalizedPattern, fuzziResults, searcher, validate);
      }
   }
   private serializeNode(node: TrieNode<number>): any {
      const serializedNode: any = {
         isEndOfText: node.isEndOfText,
         children: {},
      };
      if (isDefined(node.getValue())) {
         serializedNode.value = node.getValue();
      }
      for (const [key, childNode] of node.children.entries()) {
         serializedNode.children[key] = this.serializeNode(childNode);
      }
      return serializedNode;
   }

   serialize(): any {
      return this.serializeNode(this.root);
   }

   private deserializeNode(data: any): TrieNode<number> {
      const node = new TrieNode<number>();
      node.isEndOfText = data.isEndOfText;
      if (isDefined(data.value)) {
         node.setValue(data.value);
      }
      for (const [key, childData] of Object.entries(data.children)) {
         node.children.set(key, this.deserializeNode(childData));
      }
      return node;
   }

   deserialize(data: any): void {
      this.root = this.deserializeNode(data);
   }
   searchInArray(pattern: string, validate = (obj: any) => true) {
      const searcher = new BitapSearch(pattern, this.options?.searchOption);
      const fuzziResults = [];
      const start = Date.now();
      for (const [id, value] of this.data.entries()) {
         const results: any[] = [];

         for (const key of this.keys) {
            const text = getFn(value, key);
            const result = searcher.searchIn(text);
            results.push(result);
         }
         if (results.some((result) => result.isMatch)) {
            const minResultScore = results.reduce(
               (minScore, currentScore) => (currentScore.score < minScore.score ? currentScore : minScore),
               results[0],
            );
            const result = {
               ...value,
               score: minResultScore.score,
            };
            const isValide = validate(result);
            if (isValide) {
               fuzziResults.push(result);
            }
         }
      }
      const end = Date.now();
      console.log("SEARCH WITH ITERATE", end - start, "ms", fuzziResults.length);
   }
}
/**
 * 
 * 
 * searchFuzziO(
        pattern: string,
        validate = (value: TrieResultValue<T>) => true
    ): TrieResultValue<T>[] {
        const normalizedPattern = pattern.toLowerCase();
        const fuzziResults: TrieResultValue<T>[] = [];
        const searcher = new BitapSearch(pattern, this.options?.searchOption);

        const searchFuzziRecursive = (
            node: TrieNode<number>,
            currentText: string,
            startIndex: number
        ) => {
            if (node.isEndOfText) {
                const nodeId = node.getValue()!;
                if (!this.resultId.has(nodeId)) {
                    const value = this.data.get(nodeId)!;
                    const results: any[] = [];

                    for (const key of this.keys) {
                        const text = getFn(value, key) as string;
                        const result = searcher.searchIn(text);
                        results.push(result);
                    }

                    if (results.some(result => result.isMatch)) {
                        const minResultScore = results.reduce(
                            (minScore, currentScore) =>
                                currentScore.score < minScore.score
                                    ? currentScore
                                    : minScore,
                            results[0]
                        );
                        const result = {
                            ...value,
                            score: minResultScore.score
                        };
                        const isValid = validate(result);
                        if (isValid) {
                            fuzziResults.push(result);
                            this.resultId.add(nodeId);
                        }
                    }
                }
            }

            for (const [char, child] of node.children.entries()) {
                const nextText = currentText + char;
                const nextStartIndex = searcher.getNextStartIndex(
                    nextText,
                    normalizedPattern,
                    startIndex
                );
                if (nextStartIndex !== -1) {
                    searchFuzziRecursive(child, nextText, nextStartIndex);
                }
            }
        };

        searchFuzziRecursive(this.root, "", 0);
        console.log(fuzziResults.length)
        this.resultId = new Set();
        return fuzziResults;
    }
 */
