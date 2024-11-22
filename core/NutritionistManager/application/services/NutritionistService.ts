import { AppServiceResponse, Message, UseCase } from "@shared";
import {
   SignUpRequest,
   SignInRequest,
   ValidateTokenRequest,
   RefreshTokenRequest,
   SignUpResponse,
   SignInResponse,
   ValidateTokenResponse,
   RefreshTokenResponse,
} from "../useCases";
import { INutritionistService } from "./interfaces/NutritionistService";

export class NutritionistService implements INutritionistService {
   constructor(
      private signUpUC: UseCase<SignUpRequest,SignUpResponse>,
      private signInUC: UseCase<SignInRequest,SignInResponse>,
      private validatetokenUC: UseCase<ValidateTokenRequest,ValidateTokenResponse>,
      private refreshTokenUC: UseCase<RefreshTokenRequest,RefreshTokenResponse>
   ) {}
   async signUp(req: SignUpRequest): Promise<AppServiceResponse<void> | Message> {
      const res = await this.signUpUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      else return { data: res.value.val };
   }
   async signIn(req: SignInRequest): Promise<AppServiceResponse<{ accessToken: string; refreshToken: string }> | Message> {
      const res = await this.signInUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      else return { data: res.value.val };
   }
   async validateToken(req: ValidateTokenRequest): Promise<AppServiceResponse<{ unique_id: string; email: string }> | Message> {
      const res = await this.validatetokenUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      else return { data: res.value.val };
   }
   async refreshToken(req: RefreshTokenRequest): Promise<AppServiceResponse<{ accessToken: string; refreshToken: string }> | Message> {
      const res = await this.refreshTokenUC.execute(req);
      if (res.isLeft()) return new Message("error", JSON.stringify(res.value.err));
      else return { data: res.value.val };
   }
}
