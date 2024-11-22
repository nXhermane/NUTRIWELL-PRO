export default function createPatternAlphabet(pattern: string): any {
   let mask: any = {};

   for (let i = 0, len = pattern.length; i < len; i += 1) {
      const char = pattern.charAt(i);
      mask[char] = (mask[char] || 0) | (1 << (len - i - 1));
   }

   return mask;
}
