import { IAuthNutritionistService } from "./interfaces/AuthNutritionistService";
import { NutritionistRepository, NutritionistRepositoryNotFoundException, RefreshTokenRepository } from "./../../infrastructure";
import { Nutritionist } from "./../aggregates/Nutritionist";
import bcrypt from "bcryptjs";
import { Result, ENV, Email } from "@shared";

import jwt from "jsonwebtoken";

export class AuthNutritionistService implements IAuthNutritionistService {
   constructor(
      private repo: NutritionistRepository,
      private refreshTokenRepo: RefreshTokenRepository,
   ) {}

   private async checkEmailExistence(email: Email): Promise<Result<boolean>> {
      const emailExist = await Result.encapsulateAsync<Nutritionist>(async () => {
         return this.repo.getByEmail(email);
      });

      if (emailExist.isSuccess) {
         return Result.fail<boolean>("The email address already exists.");
      }

      if (emailExist.isFailure && !(emailExist.err instanceof NutritionistRepositoryNotFoundException)) {
         return Result.fail<boolean>("Error checking email existence.");
      }

      return Result.ok(true);
   }

   async signUp(nutritionist: Nutritionist, password: string): Promise<Result<boolean>> {
      const { email, id } = nutritionist.getProps();

      const emailCheck = await this.checkEmailExistence(email);
      if (emailCheck.isFailure) return emailCheck;

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const saveState = await Result.encapsulateAsync<boolean>(async () => {
         await this.repo.save(nutritionist);
         await this.repo.savePasswordHash(id, hashPassword);
         return true;
      });

      if (saveState.isFailure) return Result.fail<boolean>("Failed to save nutritionist or password.");

      return Result.ok(true);
   }

   async signUpWithGoogle(nutritionist: Nutritionist, googleIdToken: string): Promise<Result<boolean>> {
      const { email, id } = nutritionist.getProps();

      const emailCheck = await this.checkEmailExistence(email);
      if (emailCheck.isFailure) return emailCheck;

      // TODO: Validate googleIdToken with Google's API

      const saveState = await Result.encapsulateAsync<boolean>(async () => {
         await this.repo.save(nutritionist);
         await this.repo.saveGoogleId(id, googleIdToken);
         return true;
      });

      if (saveState.isFailure) return Result.fail<boolean>("Failed to save nutritionist or googleIdToken.");

      return Result.ok(true);
   }

   async login(email: Email, password: string): Promise<Result<{ accessToken: string; refreshToken: string }>> {
      const nutritionistResult = await Result.encapsulateAsync<Nutritionist>(async () => {
         return this.repo.getByEmail(email);
      });

      if (nutritionistResult.isFailure) {
         return Result.fail<{ accessToken: string; refreshToken: string }>("The email or password is not correct.");
      }

      const nutritionist = nutritionistResult.val;
      const hashPassword = await this.repo.getPasswordHash(nutritionist.id);

      if (!hashPassword) {
         return Result.fail<{ accessToken: string; refreshToken: string }>("The email or password is not correct.");
      }

      const isPasswordValid = await bcrypt.compare(password, hashPassword);
      if (!isPasswordValid) {
         return Result.fail<{ accessToken: string; refreshToken: string }>("The password is incorrect.");
      }
      const tokens = this.generateToken(nutritionist);
      await this.refreshTokenRepo.save(nutritionist.id, tokens.refreshToken);
      return Result.ok<{ accessToken: string; refreshToken: string }>(tokens);
   }

   async validateAccessToken(token: string): Promise<Result<{ unique_id: string; email: string }>> {
      try {
         const payload = jwt.verify(token, ENV.jwtSignKey) as { unique_id: string; email: string };
         return Result.ok<{ unique_id: string; email: string }>(payload);
      } catch (e) {
         return Result.fail<{ unique_id: string; email: string }>("The jwt token is not valide.");
      }
   }
   async refreshAccessToken(refreshToken: string): Promise<Result<{ accessToken: string; refreshToken: string }>> {
      try {
         const payloadRefresh = jwt.verify(refreshToken, ENV.jwtSignKey);
         const nutritionist = await this.repo.getById(payloadRefresh.unique_id);
         const repoRefreshToken = await this.refreshTokenRepo.getById(nutritionist.id);
         if (refreshToken !== repoRefreshToken) return Result.fail<{ accessToken: string; refreshToken: string }>("the jwt is not valid");
         const tokens = this.generateToken(nutritionist);
         await this.refreshTokenRepo.save(nutritionist.id, tokens.refreshToken);
         return Result.ok<{ accessToken: string; refreshToken: string }>(tokens);
      } catch (e) {
         return Result.fail<{ accessToken: string; refreshToken: string }>(`${e.constructor.name}`);
      }
   }
   async logout(refreshToken: string): Promise<void> {
      const payloadRefresh = jwt.verify(refreshToken, ENV.jwtSignKey);
      const nutritionist = await this.repo.getById(payloadRefresh.unique_id);
      await this.refreshTokenRepo.delete(nutritionist.id);
   }
   private generateToken(nutritionist: Nutritionist): { accessToken: string; refreshToken: string } {
      const accessToken = jwt.sign({ unique_id: nutritionist.id, email: nutritionist.email }, ENV.jwtSignKey, { expiresIn: "8h" });
      const refreshToken = jwt.sign({ unique_id: nutritionist.id }, ENV.jwtSignKey, { expiresIn: "24h" });
      return { accessToken, refreshToken };
   }
}
