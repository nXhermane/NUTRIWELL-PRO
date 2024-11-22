import { SearchFoodResponse } from "./SearchFoodResponse";
import { SearchFoodRequest } from "./SearchFoodRequest";
import { UseCase, Mapper, AppError, left, right, Result, SearchEngineResult, ISearchEngine } from "@shared";
import { FoodDto, FoodNamePersistenceType, FoodRepository, FoodRepositoryError, FoodRepositoryNotFoundException } from "./../../../../infrastructure";
import { Food } from "./../../../../domain";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class SearchFoodUseCase implements UseCase<SearchFoodRequest, SearchFoodResponse> {
   private readonly searchItemStoreKey = "foodSearchEngine";
   private activeTime = 4 * 60 * 1000;
   private timeOutId: ReturnType<typeof setTimeout> | null = null;
   private isReset: boolean = false;
   private _defaultLimit = 500;
   constructor(
      private repo: FoodRepository,
      private mapper: Mapper<Food, FoodNamePersistenceType, FoodDto>,
      private searchEngine: ISearchEngine<FoodDto>,
   ) {
      this.initSearchEngine();
   }

   async execute(request: SearchFoodRequest): Promise<SearchFoodResponse> {
      try {
         this.clearTimer();
         if (this.isReset) {
            await this.initSearchEngine();
         }
         const results = this.searchEngine.search(request.searchValue);
         return right(Result.ok<FoodDto[]>(results.map((result: SearchEngineResult<FoodDto>) => result.item)));
      } catch (e) {
         return left(new AppError.UnexpectedError(e));
      }
   }

   private async initSearchEngine() {
      const response = await this.getSearchEngineDataFromStoreAndReconstruct();
      if (response) {
         let countPage = 0;
         let isFinish = false;
         while (!isFinish) {
            try {
               const foodsBloc = await this.repo.getAllFood(undefined, {
                  page: countPage * this._defaultLimit,
                  pageSize: this._defaultLimit,
               });

               for (const doc of foodsBloc) {
                  this.searchEngine.addDoc(this.mapper.toResponse(doc));
               }
               if (foodsBloc.length === 0) isFinish = true;
               countPage++;
            } catch (e) {
               if (e instanceof FoodRepositoryNotFoundException || e instanceof FoodRepositoryError) {
                  isFinish = true;
               } else {
                  throw new AppError.UnexpectedError(e);
               }
            }
         }
      }
      this.setTimer();
   }
   private async storeSearchEngineDataAndReset() {
      try {
         if (this.isReset) return;
         await AsyncStorage.setItem(this.searchItemStoreKey, this.searchEngine.toJSON());
         this.searchEngine.reset();
         this.isReset = true;
      } catch (e) {
         console.log(`Erreur lors du storckage des donnees du search engine ${this.constructor.name}.${this.storeSearchEngineDataAndReset.name}`);
      }
   }
   private async getSearchEngineDataFromStoreAndReconstruct(): Promise<boolean> {
      try {
         const value = await AsyncStorage.getItem(this.searchItemStoreKey);
         if (value !== null) {
            this.searchEngine.reconstruct(value);
            return true;
         } else {
            return false;
         }
      } catch (e) {
         console.log(
            `Erreur lors de la recupération des donnees du search engine ${this.constructor.name}.${this.getSearchEngineDataFromStoreAndReconstruct.name}`,
         );
         return false;
      }
   }

   private setTimer() {
      this.timeOutId = setTimeout(async () => {
         await this.storeSearchEngineDataAndReset();
      }, this.activeTime);
   }
   private clearTimer() {
      if (this.timeOutId != null) clearTimeout(this.timeOutId);
   }
}
