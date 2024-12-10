import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import { GoogleSignin, GoogleSigninButton, statusCodes, isErrorWithCode, isSuccessResponse } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
   webClientId: "739619233876-gaeghecmvnrebtq4gjeg5cme79p1gp23.apps.googleusercontent.com",
   offlineAccess: true,
});

const index2 = () => {
   const [user, setUser] = useState(null);
   const signIn = async () => {
      try {
         await GoogleSignin.hasPlayServices();
         const response = await GoogleSignin.signIn();
         if (isSuccessResponse(response)) {
            setUser(response.data as any);
            console.log(response.data)
         } else {
            // sign in was cancelled by user
         }
      } catch (error) {
         if (isErrorWithCode(error)) {
            switch (error.code) {
               case statusCodes.IN_PROGRESS:
                  console.log("In Progress");
                  // operation (eg. sign in) already in progress
                  break;
               case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                  console.log("the service not available");
                  // Android only, play services not available or outdated
                  break;
               default:
               // some other error happened
            }
         } else {
            console.log("error");
            // an error that's not related to google sign in occurred
         }
      }
   };
   return (
      <View>
         <Text>Hello I'm the second page</Text>
         <Button title={"Sign IN "} onPress={signIn} />
      </View>
   );
};

export default index2;
