export default function levenshteinDistance(a: string, b: string) {
   if (a.length === 0) return b.length;
   if (b.length === 0) return a.length;

   const matrix: number[][] = [];

   // Initialize matrix
   for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
   }

   for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
   }

   // Fill in the matrix
   for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
         const cost = a[j - 1] === b[i - 1] ? 0 : 1;
         matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      }
   }

   return matrix[b.length][a.length];
}
