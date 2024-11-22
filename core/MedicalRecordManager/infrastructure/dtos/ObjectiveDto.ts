import { BaseEntityProps } from "@shared";

export interface ObjectiveDto extends BaseEntityProps {
   type: "Measure" | "General";
   timeframe: { start: string; end: string };
   body:
      | {
           value: number;
           description: string;
           measureTypeId: string;
        }
      | { description: string };
   status: "InProgress" | "Achieved" | "NotAchieved";
}
