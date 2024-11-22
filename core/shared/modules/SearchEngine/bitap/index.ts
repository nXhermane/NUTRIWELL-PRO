import search from "./search";
import createPatternAlphabet from "./createPatternAlphabet";

import Config from "./../config";

const MAX_BITS = Config.MAX_BITS;
export interface BitapSearchOptions {
   location?: number;
   threshold?: number;
   distance?: number;
   includeMatches?: boolean;
   findAllMatches?: boolean;
   minMatchCharLength?: number;
   isCaseSensitive?: boolean;
   ignoreLocation?: boolean;
}

interface Chunk {
   pattern: string;
   alphabet: Record<string, number>;
   startIndex: number;
}

interface SearchResult {
   isMatch: boolean;
   score: number;
   indices?: number[][];
}

export default class BitapSearch {
   private options: BitapSearchOptions;
   private pattern: string;
   private chunks: Chunk[];

   constructor(pattern: string, options: BitapSearchOptions = {}) {
      this.options = {
         location: Config.location,
         threshold: Config.threshold,
         distance: Config.distance,
         includeMatches: Config.includeMatches,
         findAllMatches: Config.findAllMatches,
         minMatchCharLength: Config.minMatchCharLength,
         isCaseSensitive: Config.isCaseSensitive,
         ignoreLocation: Config.ignoreLocation,
         ...options,
      };

      this.pattern = this.options.isCaseSensitive ? pattern : pattern.toLowerCase();
      this.chunks = [];

      if (!this.pattern.length) {
         return;
      }

      const addChunk = (pattern: string, startIndex: number) => {
         this.chunks.push({
            pattern,
            alphabet: createPatternAlphabet(pattern),
            startIndex,
         });
      };

      const len = this.pattern.length;

      if (len > MAX_BITS) {
         let i = 0;
         const remainder = len % MAX_BITS;
         const end = len - remainder;

         while (i < end) {
            addChunk(this.pattern.substr(i, MAX_BITS), i);
            i += MAX_BITS;
         }

         if (remainder) {
            const startIndex = len - MAX_BITS;
            addChunk(this.pattern.substr(startIndex), startIndex);
         }
      } else {
         addChunk(this.pattern, 0);
      }
   }

   public searchIn(text: string): SearchResult {
      const { isCaseSensitive, includeMatches } = this.options;
      let searchText = text;

      if (!isCaseSensitive) {
         searchText = text.toLowerCase();
      }

      // Exact match
      if (this.pattern === searchText) {
         let result: SearchResult = {
            isMatch: true,
            score: 0,
         };

         if (includeMatches) {
            result.indices = [[0, text.length - 1]];
         }

         return result;
      }

      // Otherwise, use Bitap algorithm
      const { location, distance, threshold, findAllMatches, minMatchCharLength, ignoreLocation } = this.options;

      let allIndices: number[][] = [];
      let totalScore = 0;
      let hasMatches = false;

      this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
         const { isMatch, score, indices } = search(text, pattern, alphabet, {
            location: location! + startIndex,
            distance,
            threshold,
            findAllMatches,
            minMatchCharLength,
            includeMatches,
            ignoreLocation,
         });

         if (isMatch) {
            hasMatches = true;
         }

         totalScore += score;

         if (isMatch && indices) {
            allIndices = [...allIndices, ...indices];
         }
      });

      let result: SearchResult = {
         isMatch: hasMatches,
         score: hasMatches ? totalScore / this.chunks.length : 1,
      };

      if (hasMatches && includeMatches) {
         result.indices = allIndices;
      }

      return result;
   }
   getNextStartIndex(text: string, pattern: string, startIndex: number): number {
      const { isCaseSensitive } = this.options;
      let searchText = text;

      if (!isCaseSensitive) {
         searchText = text.toLowerCase();
         pattern = pattern.toLowerCase();
      }

      const { location, distance, threshold, minMatchCharLength } = this.options;

      for (let i = startIndex; i < searchText.length; i++) {
         const chunk = {
            pattern,
            alphabet: createPatternAlphabet(pattern),
            startIndex: i,
         };

         const { isMatch } = search(searchText, pattern, chunk.alphabet, {
            location: location! + i,
            distance,
            threshold,
            findAllMatches: false,
            minMatchCharLength,
            includeMatches: false,
            ignoreLocation: true,
         });

         if (isMatch) {
            return i;
         }
      }

      return -1;
   }
}
