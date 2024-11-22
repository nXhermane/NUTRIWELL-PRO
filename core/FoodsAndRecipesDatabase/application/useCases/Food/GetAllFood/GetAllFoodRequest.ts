import { Paginated } from "@shared";

export type GetAllFoodRequest = {
   foodOrigin?: string;
   paginated?: Paginated;
};
