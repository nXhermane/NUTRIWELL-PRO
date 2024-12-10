import { Stack } from "expo-router";
import * as Linking from "expo-linking";

export default function RootLayout() {
   return (
      <Stack
         screenOptions={{
            headerStyle: {
               backgroundColor: "#f4511e",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
               fontWeight: "bold",
            },
         }}
      >
         {/* Optionally configure static options outside the route.*/}
         <Stack.Screen name="index" options={{}} />
         <Stack.Screen name="index2" options={{}} />
      </Stack>
   );
}
