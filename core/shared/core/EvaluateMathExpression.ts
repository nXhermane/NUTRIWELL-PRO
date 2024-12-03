import SmartCalc from "smartcal";

export class EvaluateMathExpression {
    static evaluate<T extends { [key: string]: number | string | any[]; }>(expression: string, data: T): string | number | any[] {
        return SmartCalc<T>(expression, data)
    }
}