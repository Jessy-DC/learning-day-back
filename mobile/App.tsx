import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { RootStackParamList } from "./src/navigation/types";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AddNotionScreen } from "./src/screens/AddNotionScreen";
import { QuizScreen } from "./src/screens/QuizScreen";
import { NotionsListScreen } from "./src/screens/NotionsListScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#f8fafc",
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Learning Day" }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: "Révision" }}
        />
        <Stack.Screen
          name="AddNotion"
          component={AddNotionScreen}
          options={{ title: "Ajouter une notion" }}
        />
        <Stack.Screen
          name="NotionsList"
          component={NotionsListScreen}
          options={{ title: "Mes notions" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
