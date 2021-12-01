/**
 *    Copyright (C) 2021 AzureRain
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation; version 3.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Portal, Provider as PaperProvider } from 'react-native-paper';
import { Linking, StatusBar, useColorScheme } from 'react-native';
import SettingsScreen from './components/screens/SettingsScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchScreen from './components/screens/SearchScreen';
import { DefaultTheme, DarkTheme } from './components/common/themes';
import { InitSqliteDB, UnInitSqliteDB } from './components/common/utils';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabParamList, Dict, StackParamList } from './types';
import AboutLicenseScreen from './components/screens/AboutLicenseScreen';
import CharaDetailScreen from './components/screens/CharaDetailScreen';
import {
  RenderHTMLConfigProvider,
  TRenderEngineProvider,
} from 'react-native-render-html';
import BookmarkScreen from './components/screens/BookmarkScreen';
import HomeScreen from './components/screens/HomeScreen';
import WebViewScreen from './components/screens/WebViewScreen';
import { TopNavigationContainer } from './config';

const Stack = createStackNavigator<StackParamList>();
const Tab = createMaterialBottomTabNavigator<BottomTabParamList>();

export const dBContext = React.createContext<boolean>(false);
export const asyncStorageContext = React.createContext<Dict>({
  updated: 0,
  updateStatus: () => {},
});

const HomeTabNavigator = () => {
  const iconColor = useColorScheme() === 'dark' ? 'black' : 'white';
  const iconSize = 24;

  return (
    <Portal.Host>
      <Tab.Navigator
        //@ts-ignore
        tabBarOptions={{ showIcon: true }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: tabInfo => (
              <MaterialIcons name="home" size={iconSize} color={iconColor} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: tabInfo => (
              <MaterialIcons name="search" size={iconSize} color={iconColor} />
            ),
          }}
        />
        <Tab.Screen
          name="Bookmark"
          component={BookmarkScreen}
          options={{
            tabBarIcon: tabInfo => (
              <MaterialIcons
                name="bookmark"
                size={iconSize}
                color={iconColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: tabInfo => (
              <MaterialIcons
                name="settings"
                size={iconSize}
                color={iconColor}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </Portal.Host>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [dBReady, setDBReady] = useState<boolean>(false);
  const [asyncStorageUpdated, setAsyncStorageUpdated] = useState<number>(0);

  useEffect(() => {
    console.log('App On Mount');
    InitSqliteDB().then(() => setDBReady(true));
    return () => {
      console.log('App Will Unmount');
      UnInitSqliteDB();
    };
  }, []);

  return (
    <NavigationContainer
      theme={isDarkMode ? DarkTheme : DefaultTheme}
      ref={TopNavigationContainer}>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
      <TRenderEngineProvider baseStyle={{ fontSize: '16px' }}>
        <RenderHTMLConfigProvider
          enableExperimentalMarginCollapsing={true}
          renderersProps={{
            a: {
              onPress: async (_e: any, href: string) => {
                if (await Linking.canOpenURL(href)) {
                  TopNavigationContainer.current?.navigate('WebView', {
                    uri: href,
                  });
                }
              },
            },
          }}>
          <PaperProvider theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <dBContext.Provider value={dBReady}>
              <asyncStorageContext.Provider
                value={{
                  updated: asyncStorageUpdated,
                  updateStatus: setAsyncStorageUpdated,
                }}>
                <Stack.Navigator
                  initialRouteName="Top"
                  screenOptions={{
                    headerShown: true,
                  }}>
                  <Stack.Screen
                    name="Top"
                    component={HomeTabNavigator}
                    options={{
                      title: 'Top',
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen name="About" component={AboutLicenseScreen} />
                  <Stack.Screen name="Detail" component={CharaDetailScreen} />
                  <Stack.Screen name="WebView" component={WebViewScreen} />
                </Stack.Navigator>
              </asyncStorageContext.Provider>
            </dBContext.Provider>
          </PaperProvider>
        </RenderHTMLConfigProvider>
      </TRenderEngineProvider>
    </NavigationContainer>
  );
};

export default App;
