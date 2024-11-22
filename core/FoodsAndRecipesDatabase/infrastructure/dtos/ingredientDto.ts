import { AggregateID } from "@shared";
import { QuantityDto } from "./quantityDto";

export type IngredientDto = {
    name: string;
    quantity: QuantityDto;
    foodId: AggregateID;
 };