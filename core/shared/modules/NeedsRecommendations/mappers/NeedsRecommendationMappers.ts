import { Mapper, NeedsRecommendation, NeedsRecommendationDto } from "@shared";

export class NeedsRecommendationMapper {
    static toDto(recommendation: NeedsRecommendation): NeedsRecommendationDto {
        const props = recommendation.unpack()
        return {
            type: props.type,
            priority: props.priority,
            nutrientTagName: props.nutrientTagName,
            desciption: props.desciption,
            data: props.data,
            startDate: props.startDate?.toString(),
            endDate: props.endDate?.toString(),
            condition: props.condition && {
                expression: props.condition.expression,
                variableTable: props.condition.variableTable
            }
        }
    }



}