import Config from "./../config";

function computeScore(
   pattern: string,
   {
      errors = 0,
      currentLocation = 0,
      expectedLocation = 0,
      distance = Config.distance,
      ignoreLocation = Config.ignoreLocation,
   }: {
      errors?: number;
      currentLocation?: number;
      expectedLocation?: number;
      distance?: number;
      ignoreLocation?: boolean;
   } = {},
): number {
   const accuracy: number = errors / pattern.length;

   if (ignoreLocation) {
      return accuracy;
   }

   const proximity: number = Math.abs(expectedLocation - currentLocation);

   if (!distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
   }

   return accuracy + proximity / distance;
}

export default computeScore;
