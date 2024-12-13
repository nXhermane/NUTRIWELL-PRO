import { AggregateID } from "@/core/shared";

export type CreateIntakeDataProps = {
    date: string;
    foodOrRecipeId: AggregateID;
    isRecipe: boolean;
    nutrients: {
       value: number;
       tagname: string;
       unit: string;
    }[];
 };