import { EMPTY_PREPARATION_STEP_DESCRIPTION_ERROR, INVALID_STEP_NUMBER } from "./../constants";
import { ValueObject, FoodQuantityUnits } from "@shared";
import { Quantity } from "./Quantity";
import { AggregateID, Guard } from "@shared";
export interface IPreparationStep {
   stepNumber: number;
   description: string;
   estimatedTime?: number;
}
export class PreparationStep extends ValueObject<IPreparationStep> {
   constructor(props: IPreparationStep) {
      super(props);
      this.validate(props);
   }
   get stepNumber(): number {
      return this.props.stepNumber;
   }
   get description(): string {
      return this.props.description;
   }
   get estimatedTime(): number {
      return this.props?.estimatedTime || 0;
   }
   validate(props: IPreparationStep) {
      if (Guard.isEmpty(props.description).succeeded) {
         throw new Error(EMPTY_PREPARATION_STEP_DESCRIPTION_ERROR);
      }
      if (props.stepNumber <= 0) {
         throw new Error(INVALID_STEP_NUMBER);
      }
   }
}
