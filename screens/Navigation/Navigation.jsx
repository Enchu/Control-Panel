import React from "react";
import { Auth, Walkthrough, Welcome } from "../index";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Metrics from "../Walkthrough/Metrics";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        <Stack.Screen name="Walkthrough" component={Walkthrough} />
        <Stack.Screen name="Metrics" component={Metrics} />
        <Stack.Screen name="Auth" component={Auth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
