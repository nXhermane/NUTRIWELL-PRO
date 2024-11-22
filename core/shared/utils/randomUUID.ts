import * as Crypto from "expo-crypto";

export function randomUUID(): string {
   return Crypto.randomUUID();
}
