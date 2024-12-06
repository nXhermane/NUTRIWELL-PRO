import { Guard } from "./Guard";
import SmartCal, { isValidExpression } from "smartcal";

export class EvaluateMathExpression {
   static evaluate<T extends { [key: string]: number | string | any[] }>(expression: string, data: T): string | number | any[] {
      return SmartCal<T>(expression, data);
   }
   static isValidExpression(expression: string): boolean {
      return isValidExpression(expression) && !Guard.isEmpty(expression).succeeded;
   }
}
