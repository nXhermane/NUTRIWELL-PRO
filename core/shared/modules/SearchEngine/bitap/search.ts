import computeScore from "./computeScore";
import convertMaskToIndices from "./convertMaskToIndices";
import Config from "./../config";
import * as ErrorMsg from "./../errorMsg";

const MAX_BITS = Config.MAX_BITS;

interface SearchOptions {
   location?: number;
   distance?: number;
   threshold?: number;
   findAllMatches?: boolean;
   minMatchCharLength?: number;
   includeMatches?: boolean;
   ignoreLocation?: boolean;
}

interface SearchResult {
   isMatch: boolean;
   score: number;
   indices?: [number, number][];
}

export default function search(
   text: string,
   pattern: string,
   patternAlphabet: { [key: string]: number },
   {
      location = Config.location,
      distance = Config.distance,
      threshold = Config.threshold,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      includeMatches = Config.includeMatches,
      ignoreLocation = Config.ignoreLocation,
   }: SearchOptions = {},
): SearchResult {
   if (pattern.length > MAX_BITS) {
      throw new Error(ErrorMsg.PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
   }

   const patternLen = pattern.length;
   const textLen = text.length;
   const expectedLocation = Math.max(0, Math.min(location, textLen));
   let currentThreshold = threshold;
   let bestLocation = expectedLocation;
   const computeMatches = minMatchCharLength > 1 || includeMatches;
   const matchMask = computeMatches ? Array<boolean>(textLen) : [];

   let index;

   while ((index = text.indexOf(pattern, bestLocation)) > -1) {
      let score = computeScore(pattern, {
         currentLocation: index,
         expectedLocation,
         distance,
         ignoreLocation,
      });

      currentThreshold = Math.min(score, currentThreshold);
      bestLocation = index + patternLen;

      if (computeMatches) {
         let i = 0;
         while (i < patternLen) {
            matchMask[index + i] = true;
            i += 1;
         }
      }
   }

   bestLocation = -1;
   let lastBitArr: number[] = [];
   let finalScore = 1;
   let binMax = patternLen + textLen;
   const mask = 1 << (patternLen - 1);

   for (let i = 0; i < patternLen; i += 1) {
      let binMin = 0;
      let binMid = binMax;

      while (binMin < binMid) {
         const score = computeScore(pattern, {
            errors: i,
            currentLocation: expectedLocation + binMid,
            expectedLocation,
            distance,
            ignoreLocation,
         });

         if (score <= currentThreshold) {
            binMin = binMid;
         } else {
            binMax = binMid;
         }

         binMid = Math.floor((binMax - binMin) / 2 + binMin);
      }

      binMax = binMid;
      let start = Math.max(1, expectedLocation - binMid + 1);
      let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;

      let bitArr: number[] = Array<number>(finish + 2);
      bitArr[finish + 1] = (1 << i) - 1;

      for (let j = finish; j >= start; j -= 1) {
         let currentLocation = j - 1;
         let charMatch = patternAlphabet[text.charAt(currentLocation)];

         if (computeMatches) {
            matchMask[currentLocation] = !!charMatch;
         }

         bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

         if (i) {
            bitArr[j] |= ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
         }

         if (bitArr[j] & mask) {
            finalScore = computeScore(pattern, {
               errors: i,
               currentLocation,
               expectedLocation,
               distance,
               ignoreLocation,
            });

            if (finalScore <= currentThreshold) {
               currentThreshold = finalScore;
               bestLocation = currentLocation;

               if (bestLocation <= expectedLocation) {
                  break;
               }

               start = Math.max(1, 2 * expectedLocation - bestLocation);
            }
         }
      }

      const score = computeScore(pattern, {
         errors: i + 1,
         currentLocation: expectedLocation,
         expectedLocation,
         distance,
         ignoreLocation,
      });

      if (score > currentThreshold) {
         break;
      }

      lastBitArr = bitArr;
   }

   const result: SearchResult = {
      isMatch: bestLocation >= 0,
      score: Math.max(0.001, finalScore),
   };

   if (computeMatches) {
      const indices = convertMaskToIndices(matchMask, minMatchCharLength);
      if (!indices.length) {
         result.isMatch = false;
      } else if (includeMatches) {
         result.indices = indices;
      }
   }

   return result;
}
