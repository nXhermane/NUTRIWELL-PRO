import Config from "./../config";

function convertMaskToIndices(matchmask: boolean[] = [], minMatchCharLength: number = Config.minMatchCharLength): [number, number][] {
   const indices: [number, number][] = [];
   let start = -1;
   let end = -1;
   let i = 0;
   for (let len = matchmask.length; i < len; i += 1) {
      const match = matchmask[i];
      if (match && start === -1) {
         start = i;
      } else if (!match && start !== -1) {
         end = i - 1;
         if (end - start + 1 >= minMatchCharLength) {
            indices.push([start, end]);
         }
         start = -1;
      }
   }

   // (i-1 - start) + 1 => i - start
   if (matchmask[i - 1] && i - start >= minMatchCharLength) {
      indices.push([start, i - 1]);
   }

   return indices;
}

export default convertMaskToIndices;
