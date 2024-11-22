import { ValueObject, InvalidReference, AggregateID, Guard, EmptyStringError } from "@shared";

export interface IAversion {
   name: string;
   foodId: AggregateID;
}

export class Aversion extends ValueObject<IAversion> {
   validate(props: IAversion): void {
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("Le nom de l'averaion alimentaire ne doit être vide.");
      if (Guard.isEmpty(props.foodId).succeeded) throw new EmptyStringError("La reference a l'aliment ne doit être vide.");
   }
   validateFoodId(foodIds: AggregateID[]) {
      if (!foodIds.includes(this.props.foodId)) throw new InvalidReference("La reference a l'aliement n'est pas correcte");
   }
}
