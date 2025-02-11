import { UserSessionDto } from "../dtos";
import { MobileAuthService } from "./interfaces/MobileAuthSercie";
import { ConfigureParams, GoogleSignin, isSuccessResponse, SignInParams } from "@react-native-google-signin/google-signin";
export class GoogleAuthService implements MobileAuthService {
   async signIn(params?: SignInParams): Promise<UserSessionDto> {
      if (!GoogleSignin.hasPreviousSignIn()) {
         await GoogleSignin.hasPlayServices();
         const response = await GoogleSignin.signIn(params);
         if (isSuccessResponse(response)) {
         }
      }
      return {} as UserSessionDto;
   }
   signOut(): Promise<void> {
      throw new Error("Method not implemented.");
   }
   getTokens(): Promise<{ accessToken: string; refreshToken: string }> {
      throw new Error("Method not implemented.");
   }
   /**
    * Configure le google signin module; Assurer vous d'appler cette method lors du demarage de l'application
    * @param options Options de configuration des services googles a utilise
    */
   static configure(options?: ConfigureParams): any {
      GoogleSignin.configure(options);
   }
}
