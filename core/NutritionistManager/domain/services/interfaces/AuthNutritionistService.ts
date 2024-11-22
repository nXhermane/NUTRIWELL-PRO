import { Nutritionist } from "./../../aggregates/Nutritionist";
import { Email, Result } from "@shared";
export interface IAuthNutritionistService {
   signUp(nutritionist: Nutritionist, password: string): Promise<Result<boolean>>;
   //   signUpWithGoogle(nutritionist: Nutritionist, googleIdToken: string): Promise<Result<boolean>>;

   login(email: Email, password: string): Promise<Result<{ accessToken: string; refreshToken: string }>>;
   // loginWithGoogle(nutritionist: Nutritionist, googleIdToken: string): Promise<Result<{ accessToken: string; refreshToken: string }>>;

   validateAccessToken(token: string): Promise<Result<{ unique_id: string; email: string }>>;
   refreshAccessToken(refreshToken: string): Promise<Result<{ accessToken: string; refreshToken: string }>>;

   // verifyPassword(email: string, password: string): Promise<boolean>;

   // requestPasswordReset(email: string): Promise<void>;
   // resetPassword(resetToken: string, newPassword: string): Promise<void>;

   logout(refreshToken: string): Promise<void>;

   // linkGoogleAccount(nutritionist: Nutritionist, googleIdToken: string): Promise<void>;
   // unlinkGoogleAccount(nutritionist: Nutritionist): Promise<void>;

   // verifyEmail(emailVerificationToken: string): Promise<void>;
}
