import { UserSessionDto } from "../../dtos";

export interface MobileAuthService {
   signIn(): Promise<UserSessionDto>;
   signOut(): Promise<void>;
   getTokens(): Promise<{ accessToken: string; refreshToken: string }>;
}
