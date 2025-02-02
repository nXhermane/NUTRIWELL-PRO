import { View, Text, Button } from "react-native";
import React, { useCallback, useState } from "react";
import { GoogleSignin, GoogleSigninButton, statusCodes, isErrorWithCode, isSuccessResponse } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { FoodAndRecipe } from "@/core/FoodsAndRecipesDatabase";
import { AppServiceResponse, Message } from "@/core/shared";
import { FoodDto } from "@/core/FoodsAndRecipesDatabase/infrastructure";
GoogleSignin.configure({
   webClientId: "739619233876-gaeghecmvnrebtq4gjeg5cme79p1gp23.apps.googleusercontent.com",
   offlineAccess: true,
});

const index2 = () => {
   const [user, setUser] = useState(null);
   const [foodResult, setFoodResult] = useState<AppServiceResponse<FoodDto[]> | Message | null>(null);
   const signIn = async () => {
      try {
         await GoogleSignin.hasPlayServices();
         const response = await GoogleSignin.signIn();
         if (isSuccessResponse(response)) {
            setUser(response.data as any);
            console.log(response.data);
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

   const dddModule = useCallback(async () => {
      const foodInstance = await FoodAndRecipe.getInstance();
      console.log("Instance Recuprer avec sucess");
      const result = await foodInstance.food.getAllFood({paginated: {
         page: 1, 
         pageSize: 1
      }});
      const searchResult = await foodInstance.food.search({searchValue: "hui"})
      setFoodResult(result);
   }, []);

   return (
      <View>
         <Text>Hello I'm the second page</Text>
         <Text>{JSON.stringify(user, null, 2)}</Text>
         <Button title={"Sign IN "} onPress={signIn} />
         <Button title={"Test Food and Recipe"} onPress={dddModule} />
         <Text>{JSON.stringify(foodResult,null,2)}</Text>
      </View>
   );
};

export default index2;
