import { ValueObject, InvalidReference, AggregateID, Guard, EmptyStringError } from "@shared";

export interface IFavoriteFood {
   name: string;
   foodId: AggregateID;
}

export class FavoriteFood extends ValueObject<IFavoriteFood> {
   validate(props: IFavoriteFood): void {
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("Le nom de l'aliment préferé ne doit être vide.");
      if (Guard.isEmpty(props.foodId).succeeded) throw new EmptyStringError("La reference a l'aliment ne doit être vide.");
   }
   validateFoodId(foodIds: AggregateID[]) {
      if (!foodIds.includes(this.props.foodId)) throw new InvalidReference("La reference a l'aliement n'est pas correcte");
   }
}
