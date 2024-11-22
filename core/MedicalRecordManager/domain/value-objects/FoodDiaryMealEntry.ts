import { ValueObject, InvalidReference, Guard, ArgumentNotProvidedException, ArgumentInvalidException, AggregateID } from "@shared";
import { FoodDiaryFoodItem, IFoodDiaryFoodItem } from "./FoodDiaryFoodItem";

export interface IFoodDiaryMealEntry {
   withCompany: boolean;
   watchingTv: boolean;
   sittingAtTable: boolean;
   foodItems: FoodDiaryFoodItem[];
   mealTypeId: AggregateID;
   description: string;
}
export class FoodDiaryMealEntry extends ValueObject<IFoodDiaryMealEntry> {
   constructor(props: IFoodDiaryMealEntry) {
      super(props);
   }
   get withCompany(): boolean {
      return this.props.withCompany;
   }
   get watchingTv(): boolean {
      return this.props.watchingTv;
   }
   get sittingAtTable(): boolean {
      return this.props.sittingAtTable;
   }
   get foodItems(): IFoodDiaryFoodItem[] {
      return this.props.foodItems.map((foodItem: FoodDiaryFoodItem) => foodItem.unpack());
   }
   get description(): string {
      return this.props.description;
   }
   get mealTypeId(): AggregateID {
      return this.props.mealTypeId;
   }
   protected validate(props: IFoodDiaryMealEntry): void {
      if (Guard.isEmpty(props.description).succeeded && props.foodItems.length === 0) {
         throw new ArgumentInvalidException("Il faut fournir au moins un aliment si la description du repas n'est pas fournir");
      }
      if (Guard.isEmpty(props.mealTypeId).succeeded) {
         throw new ArgumentNotProvidedException("Le type de repas doit etre renseigner.");
      }
   }
   validateMealType(mealTypeIds: AggregateID[]) {
      if (!mealTypeIds.includes(this.props.mealTypeId)) {
         throw new InvalidReference("Le type de repas n'est pas correcte.");
      }
   }
}
