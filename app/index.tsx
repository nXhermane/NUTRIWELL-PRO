import { Text, View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as FileSystem from "expo-file-system";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSessionn from "expo-auth-session";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import { unzip } from "react-native-zip-archive";
import { useNavigation } from "expo-router";

async function readCacheDirectory(data: any) {
   const entries = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "databaseFiles");
   console.log(entries);
}

WebBrowser.maybeCompleteAuthSession();
export default function Index() {
   const navigation = useNavigation();
   const [userInfo, setUserInfo] = useState(null);
   const [progression, setProgression] = useState<number>(0);
   const redirectUri = AuthSessionn.makeRedirectUri();

   const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: "739619233876-7ifuo0et9r11m4fpq4818so50rhu5s6p.apps.googleusercontent.com",
      webClientId: "739619233876-gaeghecmvnrebtq4gjeg5cme79p1gp23.apps.googleusercontent.com",
   });

   const getUserInfo = async (token: string) => {
      if (!token) return;
      try {
         const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         const user = await response.json();
         await AsyncStorage.setItem("@user", JSON.stringify(user));
         setUserInfo(user);
      } catch (error) {
         console.error("Erreur lors de getUserInfo");
      }
   };
   async function signInWithGoole() {
      const user = await AsyncStorage.getItem("@user");
      if (!user) {
         if (response?.type === "success") {
            await getUserInfo(response.authentication?.accessToken as string);
         }
      } else {
         setUserInfo(JSON.parse(user));
      }
   }

   const showProgress = (downloadProgress: FileSystem.DownloadProgressData) => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      console.log("Progression ", progress);
      setProgression(progress);
   };

   const downloadAndExtractFile = async () => {
      const zipUrl = "https://github.com/nXhermane/nutritionAppData-nutriwell/releases/download/database/databaseFiles.rar";
      const fileUri = FileSystem.documentDirectory + "databaseFiles.rar";
      const downloadResumable = FileSystem.createDownloadResumable(zipUrl, fileUri, {}, showProgress);
      try {
         const fileInfo = await FileSystem.getInfoAsync(fileUri);
         if (!fileInfo.exists) {
            const res = await downloadResumable.downloadAsync();
            console.log("Finished downloading to ", res?.uri);
            const targetPath = FileSystem.documentDirectory + "databaseFiles";
            unzip(res?.uri as string, targetPath, "UTF-8").then((path) => {
               console.log(`unzip completed at ${path}`);
               FileSystem.readAsStringAsync(targetPath)
                  .then((data) => {
                     console.log(data);
                  })
                  .catch((error) => {
                     console.log(error);
                  });
            });
         } else {
            console.log("File existe");
         }
      } catch (error) {
         // Extraire le fichier si nécessaire (utilise expo-zip ou une autre méthode si tu veux extraire le RAR)
         // Après le téléchargement, tu peux gérer le fichier selon tes besoins (par exemple, l'extraire, le lire, etc.)
         console.error("Error downloading file:", error);
      }
   };

   useEffect(() => {
      signInWithGoole();
      downloadAndExtractFile();
   }, [response]);
   return (
      <View
         style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
         }}
      >
         <Text>{JSON.stringify(userInfo, null, 2)}</Text>

         <Button
            title="Sign in with Google"
            onPress={() => {
               promptAsync();
            }}
         />
         <Button
            title="Delete item from async storage"
            onPress={() => {
               AsyncStorage.removeItem("@user");
               setUserInfo(null);
            }}
         />
         <Text>Download Progression : {progression}</Text>
         <Button title="Navigate" onPress={() => navigation.navigate("index2" as never)} />
      </View>
   );
}
