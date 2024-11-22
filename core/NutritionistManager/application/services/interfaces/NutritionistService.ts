import { AppServiceResponse, Message } from "@/core/shared";
import { ValidateTokenRequest, SignUpRequest, SignInRequest, RefreshTokenRequest } from "../../useCases";

export interface INutritionistService {
   signUp(req: SignUpRequest): Promise<AppServiceResponse<void> | Message>;
   signIn(req: SignInRequest): Promise<AppServiceResponse<{ accessToken: string; refreshToken: string }> | Message>;
   validateToken(req: ValidateTokenRequest): Promise<AppServiceResponse<{ unique_id: string; email: string }> | Message>;
   refreshToken(req: RefreshTokenRequest): Promise<AppServiceResponse<{ accessToken: string; refreshToken: string }> | Message>;
}
