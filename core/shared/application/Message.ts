export class Message {
   constructor(
      public type: "info" | "error" | "warning",
      public content: string,
   ) {}
}
