import { SQLiteDatabase } from "expo-sqlite";
import { INutritionistService, NutritionistService, RefreshTokenUseCase, SignInUseCase, SignUpUseCase, ValidateTokenUseCase } from "./application";
import {
   ConsultationPlaceMapper,
   ConsultationPlaceRepositoryImpl,
   db,
   NutritionistMapper,
   NutritionistRepositoryImplDb,
   RefreshTokenRepositoryImplDb,
   ServiceMapper,
   ServiceRepositoryImpl,
} from "./infrastructure";
import { AuthNutritionistService } from "./domain/services";

export interface INutritionistManager {
   auth: INutritionistService;
}

export class NutritionistManager {
   private static instance: INutritionistManager | null = null;
   static async getinstance(): Promise<INutritionistManager> {
      if (NutritionistManager.instance) {
         const expo = (await db).db;
         const consultationplaceMapper = new ConsultationPlaceMapper();
         const serviceMapper = new ServiceMapper();
         const nutritionistMapper = new NutritionistMapper({
            consultationPlace: consultationplaceMapper,
            service: serviceMapper,
         });
         const nutritionistRepo = new NutritionistRepositoryImplDb(expo as SQLiteDatabase, nutritionistMapper, {
            consultationPlaceRepo: new ConsultationPlaceRepositoryImpl(expo as SQLiteDatabase, consultationplaceMapper),
            serviceRepo: new ServiceRepositoryImpl(expo as SQLiteDatabase, serviceMapper),
         });
         const authDomainService = new AuthNutritionistService(nutritionistRepo, new RefreshTokenRepositoryImplDb(expo as SQLiteDatabase));
         const signUpUC = new SignUpUseCase(authDomainService);
         const signInUC = new SignInUseCase(authDomainService);
         const validateTokenUC = new ValidateTokenUseCase(authDomainService);
         const refreshTokenUC = new RefreshTokenUseCase(authDomainService);

         const nutritionistService = new NutritionistService(signUpUC, signInUC, validateTokenUC, refreshTokenUC);

         NutritionistManager.instance = {
            auth: nutritionistService,
         };
      }
      return NutritionistManager.instance as INutritionistManager;
   }
}
