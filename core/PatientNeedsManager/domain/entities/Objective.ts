import { AggregateID, Entity, NeedsRecommendation, ObjectiveStatus, ObjectiveType, Timeframe } from "@/core/shared";

export interface IObjective {
    name: string
    type: ObjectiveType
    status: ObjectiveStatus
    description: string
    unit?: string
    timeframe: Timeframe
    measureCode?: string
    initialValue?: number
    targetValue?: number
    recommendations: NeedsRecommendation[]
    standardObjectiveId?: AggregateID
}

export class Objective extends Entity<IObjective> {
    public validate(): void {
        throw new Error("Method not implemented.");
    }

} 