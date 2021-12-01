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
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import ColorStyles from '../common/colors';
import LinkListItem from '../elements/LinkListItem';
import StackNavListItem from '../elements/StackNavListItem';
import { StackProps } from '../../types';
import { safeAreaViewStyles } from '../common/styles';

const SettingsScreen = ({ route, navigation }: StackProps) => {
  const backgroundColor =
    useColorScheme() === 'dark'
      ? ColorStyles.backgroundDarker
      : ColorStyles.backgroundLighter;

  return (
    <SafeAreaView style={safeAreaViewStyles.safeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[styles.scrollViewInner, backgroundColor]}>
        <View style={backgroundColor}>
          <StackNavListItem
            title="About"
            onPress={() => {
              navigation.navigate('About');
            }}
            description="Version and License information"
          />
          <LinkListItem
            title="Bug Report"
            description={'Report a bug on issue tracker'}
            url={
              'https://github.com/phantom-software-AZ/vtuber-handbook/issues'
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewInner: {},
});

export default SettingsScreen;
