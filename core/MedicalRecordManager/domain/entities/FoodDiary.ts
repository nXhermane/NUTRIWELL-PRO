import {
   Entity,
   CreateEntityProps,
   RegistrationDate,
   Image,
   Guard,
   ArgumentInvalidException,
   Result,
   Quantity,
   DateManager,
   ExceptionBase,
} from "./../../../shared";

import { FoodDiaryMealEntry, IFoodDiaryMealEntry } from "./../value-objects/FoodDiaryMealEntry";
import { FoodDiaryFoodItem } from "./../value-objects/FoodDiaryFoodItem";
import { CreateFoodDiaryProps, FoodItemProps } from "./../types";
import { FoodAndRecipeApi } from "@/core/FoodsAndRecipesDatabase/application";
export interface IFoodDiary {
   date: RegistrationDate;
   meal: FoodDiaryMealEntry;
   observation: string;
   images: Image[];
}

export class FoodDiary extends Entity<IFoodDiary> {
   constructor(createFoodDiaryProps: CreateEntityProps<IFoodDiary>) {
      super(createFoodDiaryProps);
   }

   set date(date: RegistrationDate) {
      this.props.date = date;
   }
   get date(): string {
      return this.props.date.toString();
   }
   get meal(): IFoodDiaryMealEntry {
      return this.props.meal.unpack();
   }
   get observation(): string {
      return this.props.observation;
   }
   set observation(value: string) {
      this.props.observation = value;
   }
   get images(): string[] {
      return this.props.images.map((img: Image) => img.uri);
   }
   getImage(): Image[] {
      return this.props.images;
   }
   set images(images: Image[]) {
      this.props.images = images;
   }
   set meal(meal: FoodDiaryMealEntry) {
      this.props.meal = meal;
      this.validate();
   }
   validate(): void {
      if (Guard.isEmpty(this.props.meal).succeeded) throw new ArgumentInvalidException("Lr repas consommée ne doit pas etre vide.");
      this._isValid = true;
   }
   static async create(foodDiary: CreateFoodDiaryProps): Promise<Result<FoodDiary>> {
      try {
         const recipeAndFoodProvider = (await FoodAndRecipeApi.getInstance())
         const mealTypeIds = await recipeAndFoodProvider.getAllMealTypeIds();
         const foodIds = await recipeAndFoodProvider.getAllFoodIds();
         const recipeIds = await recipeAndFoodProvider.getAllRecipeIds();
         const { date, meal, images, ...otherFoodDiaryProps } = foodDiary;
         const { foodItems, ...othetMealProps } = meal;
         const newFoodItems = foodItems.map((item: FoodItemProps) => {
            const { quantity, ...otherProps } = item;
            const newQuantity = new Quantity(item.quantity);
            const newFoodItem = new FoodDiaryFoodItem({
               ...otherProps,
               quantity: newQuantity,
            });
            newFoodItem.validateFoodId(foodIds);
            newFoodItem.validateRecipeId(recipeIds);
            return newFoodItem;
         });

         const newMeal = new FoodDiaryMealEntry({
            foodItems: newFoodItems,
            ...othetMealProps,
         });
         newMeal.validateMealType(mealTypeIds);
         const newImages = images.map((uri: string) => new Image(uri));
         const newFoodDiary = new FoodDiary({
            props: {
               date: new RegistrationDate(DateManager.formatDate(date)),
               meal: newMeal,
               images: newImages,
               ...otherFoodDiaryProps,
            },
         });
         return Result.ok<FoodDiary>(newFoodDiary);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<FoodDiary>(`[${e.code}]:${e.message}`)
            : Result.fail<FoodDiary>(`Erreur inattendue. ${FoodDiary.constructor.name}`);
      }
   }
}
