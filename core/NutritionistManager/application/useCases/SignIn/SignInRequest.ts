import { Email } from "@shared";

export type SignInRequest = {
   data: {
      email: Email;
      password: string;
   };
};
