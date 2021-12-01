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

/**
 * Settings screen. Wraps a ScrollView in a stack navigator.
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StackProps } from '../../types';
import WebView from 'react-native-webview';
import {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview/lib/WebViewTypes';

const WebViewScreen = ({ route, navigation }: StackProps) => {
  // console.log(route.params?.uri);
  let webview: WebView | null = null;

  const handleWebViewNavigationStateChange = (
    newNavState: WebViewNavigation,
  ) => {
    console.log('Webview handleWebViewNavigationStateChange');
    const { url } = newNavState;
    if (!url) {
      return;
    }

    webview?.injectJavaScript(
      'window.ReactNativeWebView.postMessage(document.title)',
    );
  };

  const handleMessage = (message: WebViewMessageEvent) => {
    console.log('Webview handleMessage');
    // console.log(message.nativeEvent.data);
    navigation.setOptions({ title: message.nativeEvent.data });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <WebView
        ref={ref => {
          webview = ref;
        }}
        source={{ uri: route.params?.uri }}
        style={styles.webView}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  webView: {},
});

export default WebViewScreen;
