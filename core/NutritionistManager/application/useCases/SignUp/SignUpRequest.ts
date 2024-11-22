import { CreateNutritionistProps } from "./../../../domain";
export type SignUpRequest = {
   data: { password: string }  & CreateNutritionistProps;
};
