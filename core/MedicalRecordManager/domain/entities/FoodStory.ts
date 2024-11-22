import {
   Entity,
   CreateEntityProps,
   ArgumentInvalidException,
   ArgumentOutOfRangeException,
   Time,
   AggregateID,
   InvalidReference,
   ExceptionBase,
   Result,
} from "./../../../shared";
import { FavoriteFood, IFavoriteFood } from "./../value-objects/FavoriteFood";
import { Aversion, IAversion } from "./../value-objects/Aversion";
import { WaterConsumptionRange, IWaterConsumptionRange } from "./../value-objects/WaterConsumptionRange";
import { CreateFoodStoryProps } from "./../types";
import { FoodAndRecipeApi } from "@/core/FoodsAndRecipesDatabase/application";
export interface IFoodStory {
   bedtime: Time;
   wakeUpTime: Time;
   dietTypes: Set<AggregateID>;
   favoriteFoods: FavoriteFood[];
   foodAversions: Aversion[];
   allergies: Set<AggregateID>;
   foodIntolerances: Set<AggregateID>;
   nutritionalDeficiencies: Set<AggregateID>;
   waterConsumption: WaterConsumptionRange;
   numberOfMealsPerDay: number;
   otherInformation: string;
}

export class FoodStory extends Entity<IFoodStory> {
   constructor(createFoodStoryProps: CreateEntityProps<IFoodStory>) {
      super(createFoodStoryProps);
   }
   get bedtime(): string {
      return this.props.bedtime.time;
   }
   get wakeUpTime(): string {
      return this.props.wakeUpTime.time;
   }
   get dietTypes(): AggregateID[] {
      return Array.from(this.props.dietTypes);
   }
   get favoriteFoods(): IFavoriteFood[] {
      return this.props.favoriteFoods.map((favFood: FavoriteFood) => favFood.unpack());
   }
   get foodAversions(): IAversion[] {
      return this.props.foodAversions.map((foodAve: Aversion) => foodAve.unpack());
   }
   get allergies(): AggregateID[] {
      return Array.from(this.props.allergies);
   }
   get foodIntolerances(): AggregateID[] {
      return Array.from(this.props.foodIntolerances);
   }
   get nutritionalDeficiencies(): AggregateID[] {
      return Array.from(this.props.nutritionalDeficiencies);
   }
   get waterConsumption(): IWaterConsumptionRange {
      return this.props.waterConsumption.unpack();
   }
   get numberOfMealsPerDay(): number {
      return this.props.numberOfMealsPerDay;
   }
   get otherInformation(): string {
      return this.props.otherInformation;
   }
   set bedtime(time: Time) {
      this.props.bedtime = time;
      this.validate();
   }
   set wakeUpTime(time: Time) {
      this.props.wakeUpTime = time;
      this.validate();
   }
   set waterConsumption(range: WaterConsumptionRange) {
      this.props.waterConsumption = range;
   }
   set numberOfMealsPerDay(value: number) {
      this.props.numberOfMealsPerDay = value;
   }
   set otherInformation(value: string) {
      this.props.otherInformation = value;
   }

   addDietType(dietTypeId: AggregateID): void {
      if (!this.props.dietTypes.has(dietTypeId)) this.props.dietTypes.add(dietTypeId);
   }
   removeDietType(dietTypeId: AggregateID): void {
      if (this.props.dietTypes.has(dietTypeId)) this.props.dietTypes.delete(dietTypeId);
   }
   addFavoriteFood(favoriteFood: FavoriteFood): void {
      this.props.favoriteFoods.push(favoriteFood);
      this.validate();
   }
   removeFavoriteFood(favoriteFood: FavoriteFood): void {
      const favoriteFoodIndex = this.props.favoriteFoods.indexOf(favoriteFood);
      if (favoriteFoodIndex !== -1) this.props.favoriteFoods.splice(favoriteFoodIndex, 1);
   }
   addFoodAversion(foodAversion: Aversion): void {
      this.props.foodAversions.push(foodAversion);
      this.validate();
   }
   removeFoodAversion(foodAversion: Aversion): void {
      const foodAversionIndex = this.props.foodAversions.indexOf(foodAversion);
      if (foodAversionIndex !== -1) this.props.foodAversions.splice(foodAversionIndex, 1);
   }
   addAllergy(allergyId: AggregateID): void {
      if (!this.props.allergies.has(allergyId)) this.props.allergies.add(allergyId);
      this.validate();
   }
   removeAllergy(allergyId: AggregateID): void {
      if (this.props.allergies.has(allergyId)) this.props.allergies.delete(allergyId);
   }
   addFoodIntolerance(foodIntolerance: AggregateID): void {
      if (!this.props.foodIntolerances.has(foodIntolerance)) this.props.foodIntolerances.add(foodIntolerance);
      this.validate();
   }
   removeFoodIntolerance(foodIntolerance: AggregateID): void {
      if (this.props.foodIntolerances.has(foodIntolerance)) this.props.foodIntolerances.delete(foodIntolerance);
   }
   addNutritionalDeficience(nutritinalDeficienceId: AggregateID): void {
      if (!this.props.nutritionalDeficiencies.has(nutritinalDeficienceId)) this.props.nutritionalDeficiencies.add(nutritinalDeficienceId);
      this.validate();
   }
   removeNutritionalDeficience(nutritionalDeficienceId: AggregateID): void {
      if (this.props.nutritionalDeficiencies.has(nutritionalDeficienceId)) this.props.nutritionalDeficiencies.delete(nutritionalDeficienceId);
   }
   validateDietType(dietTypeIds: AggregateID[]): void {
      this._isValid = false;
      for (const dietTypeId of this.props.dietTypes) {
         if (!dietTypeIds.includes(dietTypeId)) throw new InvalidReference(`La réference ${dietTypeId} au type de regime est invalide`);
      }
      this._isValid = true;
   }
   validateAllergy(allergyIds: AggregateID[]): void {
      this._isValid = false;
      for (const allergyId of this.props.allergies) {
         if (!allergyIds.includes(allergyId)) throw new InvalidReference(`La réference ${allergyId} a l'allergie est invalide`);
      }
      this._isValid = true;
   }
   validateFoodIntolerance(foodIntoleranceIds: AggregateID[]): void {
      this._isValid = false;
      for (const foodIntoleranceId of this.props.foodIntolerances) {
         if (!foodIntoleranceIds.includes(foodIntoleranceId))
            throw new InvalidReference(`La réference ${foodIntoleranceId} a l'intolerance alimentaire est invalide`);
      }
      this._isValid = true;
   }
   validateNutritionalDeficiencie(nutrientIds: AggregateID[]): void {
      this._isValid = false;
      for (const nutrientId of this.props.nutritionalDeficiencies) {
         if (!nutrientIds.includes(nutrientId)) throw new InvalidReference(`La réference ${nutrientId} au nutrinent en deficit est invalide`);
      }
      this._isValid = true;
   }
   private getFoodIdsOfAversions(): AggregateID[] {
      return this.props.foodAversions.map((foodAv: Aversion) => foodAv.unpack().foodId);
   }
   private getFoodIdsOfFavoriteFoods(): AggregateID[] {
      return this.props.favoriteFoods.map((favFood: FavoriteFood) => favFood.unpack().foodId);
   }
   validate(): void {
      if (this.props.bedtime.isAfter(this.props.wakeUpTime))
         throw new ArgumentOutOfRangeException(
            `L'heure de coucher doit être supperieur a l'heure de reveil.${this.props.bedtime.time}>${this.props.wakeUpTime.time}`,
         );
      const aversionFoodIds: AggregateID[] = this.getFoodIdsOfAversions();
      const favoriteFoodIds: AggregateID[] = this.getFoodIdsOfFavoriteFoods();
      for (const aversionId of aversionFoodIds) {
         if (favoriteFoodIds.includes(aversionId))
            throw new ArgumentInvalidException(`Un aliment ne doit être a la fois une aversion et un aliment préferé.`);
      }
      this._isValid = true;
   }
   static async create(foodStory?: CreateFoodStoryProps): Promise<Result<FoodStory>> {
      try {
         const recipeAndFoodProvider = await FoodAndRecipeApi.getInstance();
         const foodIds: AggregateID[] = await recipeAndFoodProvider.getAllFoodIds();
         const newfoodStory = new FoodStory({
            props: {
               bedtime: new Time(foodStory?.bedtime || "22:30"),
               wakeUpTime: new Time(foodStory?.wakeUpTime || "06:00"),
               dietTypes: new Set<AggregateID>(foodStory?.dietTypes || []),
               favoriteFoods:
                  foodStory?.favoriteFoods?.map((favFood: any) => {
                     const newFavFood = new FavoriteFood(favFood);
                     newFavFood.validateFoodId(foodIds);
                     return newFavFood;
                  }) || [],
               foodAversions:
                  foodStory?.foodAversions?.map((aveFood: IAversion) => {
                     const newAver = new Aversion(aveFood);
                     newAver.validateFoodId(foodIds);
                     return newAver;
                  }) || [],
               allergies: new Set<AggregateID>(foodStory?.allergies || []),
               foodIntolerances: new Set<AggregateID>(foodStory?.foodIntolerances || []),
               nutritionalDeficiencies: new Set<AggregateID>(foodStory?.nutritionalDeficiencies || []),
               waterConsumption: new WaterConsumptionRange(
                  foodStory?.waterConsumption || {
                     lowerBound: 1.5,
                     upperBound: 2,
                  },
               ),
               numberOfMealsPerDay: foodStory?.numberOfMealsPerDay || 3,
               otherInformation: foodStory?.otherInformation || "",
            },
         });
         return Result.ok<FoodStory>(newfoodStory);
      } catch (e: any) {
         return e instanceof ExceptionBase
            ? Result.fail<FoodStory>(`[${e.code}]:${e.message}`)
            : Result.fail<FoodStory>(`Erreur inattendue. ${FoodStory.constructor.name}`);
      }
   }
}
