import { INVALID_FOOD_GROUP_CODE_ERROR, EMPTY_FOOD_GROUP_NAME_ERROR } from "./../constants";
import { Entity, CreateEntityProps, EmptyStringError, Guard } from "@shared";

export interface IFoodGroup {
   foodGroupCode: string;
   foodGroupName: string;
   foodGroupNameF: string;
   foodGroupDescription?: string;
}

export class FoodGroup extends Entity<IFoodGroup> {
   constructor(foodGroupCreate: CreateEntityProps<IFoodGroup>) {
      super(foodGroupCreate);
   }
   get foodGroupCode(): string {
      return this.props.foodGroupCode;
   }
   get foodGroupName(): string {
      return this.props.foodGroupName;
   }
   set foodGroupName(value: string) {
      this.props.foodGroupName = value;
      this.validate();
   }
   get foodGroupNameF(): string {
      return this.props.foodGroupNameF;
   }
   get foodGroupDescription(): string {
      return this.props?.foodGroupDescription || "";
   }
   set foodGroupDescription(foodGroupDescription: string) {
      this.props.foodGroupDescription = foodGroupDescription;
      this.validate();
   }

   validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.foodGroupCode).succeeded) {
         throw new EmptyStringError(INVALID_FOOD_GROUP_CODE_ERROR);
      }
      if (Guard.isEmpty(this.props.foodGroupName).succeeded) {
         throw new EmptyStringError(EMPTY_FOOD_GROUP_NAME_ERROR);
      }
      this._isValid = true;
   }
}
