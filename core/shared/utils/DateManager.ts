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
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
   }
   public static dateToTimestamps(date: Date): string {
      const year = date.getUTCFullYear();
      const month = DateManager.fixDateNumberToString(date.getUTCMonth() + 1);
      const day = DateManager.fixDateNumberToString(date.getUTCDate());
      const hours = DateManager.fixDateNumberToString(date.getUTCHours());
      const minutes = DateManager.fixDateNumberToString(date.getUTCMinutes());
      const seconds = DateManager.fixDateNumberToString(date.getUTCSeconds());

      const timestampFormmat = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      return timestampFormmat;
   }
   public static dateToDateTimeString(date: Date): string {
      const year = date.getFullYear();
      const month = DateManager.fixDateNumberToString(date.getMonth() + 1);
      const day = DateManager.fixDateNumberToString(date.getDate());
      const hours = DateManager.fixDateNumberToString(date.getHours());
      const minutes = DateManager.fixDateNumberToString(date.getMinutes());
      const seconds = DateManager.fixDateNumberToString(date.getSeconds());

      const datetimeFormmat = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      return datetimeFormmat;
   }
}
