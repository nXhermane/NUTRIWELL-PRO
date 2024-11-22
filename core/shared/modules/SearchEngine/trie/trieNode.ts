export default class TrieNode<T> {
   public children: Map<string, TrieNode<T>>;
   public isEndOfText: boolean;
   public value?: T;

   constructor() {
      this.children = new Map();
      this.isEndOfText = false;
   }

   public setValue(value: T): void {
      this.value = value;
   }
   public getValue(): T {
      return this.value as T;
   }
}
