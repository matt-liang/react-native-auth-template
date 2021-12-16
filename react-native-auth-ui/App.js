import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './components/context'
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            expiresAt: action.expires
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'ADD_TIME':
          return {
            ...prevState,
            expiresAt: action.expires
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      expiresAt: null,
    }
  );


  const authContext = React.useMemo(
    () => ({
      signIn: async (expiresat) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', expires: expiresat });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      addTime: (expiresat) => {
        dispatch({ type: 'ADD_TIME', expires: expiresat })
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ actions: authContext, expiry: state.expiresAt }}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen options={{ headerShown: false }} name="AuthStack" component={AuthStack} />
          ) : (
            // User is signed in
            <Stack.Screen options={{ headerShown: false }} name="AppStack" component={AppStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}