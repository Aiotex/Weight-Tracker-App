import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, I18nManager } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import styles from './styles/styles.js';
import EntriesList from './components/entries.js';
import Analytics from './components/analytics.js';
import {Topnav, Sidenav} from './components/navbar.js';

I18nManager.allowRTL(false)

const HomeScreen = () => {
    return (
        <View style={styles.app}>
            <Text>Home</Text>
        </View>
    )
}

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Analytics">
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Entries" component={EntriesList} />
                <Drawer.Screen name="Analytics" component={Analytics} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}