export class DateManager {
   private static fixDateNumberToString(value: number): string {
      let fixedNumber = value < 10 ? "0" + value : value.toString();
      return fixedNumber;
   }

   public static now(): number {
      return Date.now();
   }
   public static get date(): Date {
      return new Date();
   }
   public static formatDate(date: Date): string {
      return date.getFullYear() + "-" + this.fixDateNumberToString(date.getMonth() + 1) + "-" + this.fixDateNumberToString(date.getDate());
   }
   public static dateToTimestamps(date: Date): string {
      const year = date.getUTCFullYear();
      const month = this.fixDateNumberToString(date.getUTCMonth() + 1);
      const day = this.fixDateNumberToString(date.getUTCDate());
      const hours = this.fixDateNumberToString(date.getUTCHours());
      const minutes = this.fixDateNumberToString(date.getUTCMinutes());
      const seconds = this.fixDateNumberToString(date.getUTCSeconds());

      const timestampFormmat = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      return timestampFormmat;
   }
   public static dateToDateTimeString(date: Date): string {
      const year = date.getFullYear();
      const month = this.fixDateNumberToString(date.getMonth() + 1);
      const day = this.fixDateNumberToString(date.getDate());
      const hours = this.fixDateNumberToString(date.getHours());
      const minutes = this.fixDateNumberToString(date.getMinutes());
      const seconds = this.fixDateNumberToString(date.getSeconds());

      const datetimeFormmat = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      return datetimeFormmat;
   }
}
