import { INutrientAmount } from "../../domain/value-objects/NutrientAmount";
import { QuantityDto } from "./quantityDto";

export type FoodDto = {
    foodId: string;
    foodCode: string;
    foodName: string;
    foodNameF: string;
    foodSource: string;
    foodOrigin: string;
    groupId: string
    groupCode: string;
    groupName: string;
    groupNameF: string;
    nutrients: INutrientAmount[]
    quantity: QuantityDto;
 };