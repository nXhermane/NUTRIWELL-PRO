import { ArgumentOutOfRangeException, CDate, Result } from "@shared";
import { INeedsRecommendation, NeedsRecommendation } from "../value-object/NeedsRecommendation";
import { NeedsRecommendationByFormular } from "../value-object/NeedsRecommendationByFormular";
import { NeedsRecommendationByExclusion } from "../value-object/NeedsRecommendationByExclusion";
import { NeedsRecommendationByInterval } from "../value-object/NeedsRecommendationByInterval";
import { NeedsRecommendationByRelativity } from "../value-object/NeedsRecommendationByRelativity";
import { NeedsRecommendationBySubstitution } from "../value-object/NeedsRecommendationBySubstitution";
import { NeedsRecommendationDto } from "./../dtos/NeedsRecommendationDto"
export class NeedsRecommendationFactory {
    static create(recommendationDto: NeedsRecommendationDto): Result<NeedsRecommendation> {
        try {
            const stardDateResult = CDate.create(recommendationDto.startDate)
            const endDateResult = CDate.create(recommendationDto.endDate)
            const props: INeedsRecommendation<any> = {
                ...recommendationDto,
                startDate: stardDateResult.isFailure ? undefined : stardDateResult.val,
                endDate: endDateResult.isFailure ? undefined : endDateResult.val
            }
            const recommendation = NeedsRecommendationFactory.getRecommendation(props)
            return Result.ok<NeedsRecommendation>(recommendation)
        } catch (error) {
            return Result.fail<NeedsRecommendation>("Could not find recommendation")
        }
    }
    private static getRecommendation(props: INeedsRecommendation<any>): NeedsRecommendation {
        switch (props.type) {
            case "Interval": return new NeedsRecommendationByInterval(props); break;
            case "Exclusion": return new NeedsRecommendationByExclusion(props); break;
            case 'Formular': return new NeedsRecommendationByFormular(props); break;
            case "Relativity": return new NeedsRecommendationByRelativity(props); break;
            case "Substitution": return new NeedsRecommendationBySubstitution(props); break;
            default: throw new ArgumentOutOfRangeException("this recommendation is not supported.")
        }
    }
}