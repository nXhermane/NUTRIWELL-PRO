import { Paginated } from "@shared"
export type GetFoodByFoodGroupRequest = {
   foodGroupId: string;
   paginated?: Paginated;
};
