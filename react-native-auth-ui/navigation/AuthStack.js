import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ForgotPassScreen from "../screens/ForgotPassScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen"
import SplashScreen from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassScreen" component={ForgotPassScreen} />
    </Stack.Navigator>
)

export default AuthStack