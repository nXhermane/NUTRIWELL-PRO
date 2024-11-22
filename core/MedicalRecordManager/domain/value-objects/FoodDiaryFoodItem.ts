import { ValueObject, InvalidReference, Quantity, Guard, ArgumentNotProvidedException, IQuantity, AggregateID } from "@shared";

export interface IFoodDiaryFoodItem {
   foodId?: AggregateID;
   recipeId?: AggregateID;
   isRecipe: boolean;
   isHomeMade: boolean;
   quantity: Quantity;
}

export class FoodDiaryFoodItem extends ValueObject<IFoodDiaryFoodItem> {
   constructor(props: IFoodDiaryFoodItem) {
      super(props);
   }
   get isRecipe(): boolean {
      return this.props.isRecipe;
   }
   get foodId(): AggregateID | undefined {
      return this.props?.foodId;
   }
   get recipeId(): AggregateID | undefined {
      return this.props?.recipeId;
   }
   get quantity(): IQuantity {
      return this.props.quantity.unpack();
   }
   get isHomeMade(): boolean {
      return this.props.isHomeMade;
   }
   protected validate(props: IFoodDiaryFoodItem): void {
      if (Guard.isEmpty(props.isRecipe).succeeded) {
         throw new ArgumentNotProvidedException("La propriété isRecipe doit etre fournir.");
      }
      if (props.isRecipe === true && Guard.isEmpty(props?.recipeId).succeeded) {
         throw new ArgumentNotProvidedException("L'id de la recette doit etre fournir lorsque c'est une recette");
      }
      if (props.isRecipe === false && Guard.isEmpty(props?.foodId).succeeded) {
         throw new ArgumentNotProvidedException("L'id de l'aliment doit être fournir lorsque ce n'est pas une recette");
      }
   }
   validateFoodId(foodIds: AggregateID[]) {
      if (!this.props.isRecipe && !foodIds.includes(this.props.foodId as AggregateID)) {
         throw new InvalidReference("La reference au food est invalide.Veillez verifier si l'aliment existe.");
      }
   }
   validateRecipeId(recipeIds: AggregateID[]) {
      if (this.props.isRecipe && recipeIds.includes(this.props.recipeId as AggregateID)) {
         throw new InvalidReference("La reference au recipe est invalide.Veillez verifier si la recette existe.");
      }
   }
}
