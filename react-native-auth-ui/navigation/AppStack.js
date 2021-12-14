import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import AnotherScreen from '../screens/AnotherScreen';
import ThirdScreen from '../screens/ThirdScreen';

const Drawer = createDrawerNavigator()

const AppStack = () => (
    <Drawer.Navigator >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Another Screen" component={AnotherScreen} />
        <Drawer.Screen name="Third Screen" component={ThirdScreen} />
    </Drawer.Navigator>
)

export default AppStack