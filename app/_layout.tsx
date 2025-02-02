import { Stack } from "expo-router";
import "./../eventrix.config";
import { EventProvider } from "domain-eventrix/react";
import { SharedEnhancedEventBus } from "domain-eventrix";

export default function RootLayout() {
   return (
      <EventProvider eventBusKey={"SharedEnhancedEventBus"}>
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
      </EventProvider>
   );
}
