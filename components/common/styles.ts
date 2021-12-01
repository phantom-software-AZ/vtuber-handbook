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

import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const ListItemStyles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingHorizontal: 24,
  },
  linkContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  link: {
    flex: 2,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.primary,
  },
  description: {
    flex: 4,
    fontWeight: '400',
    fontSize: 18,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  halfWidth: {
    width: '46%',
  },
  cardMarginCancel: {
    marginRight: '-22%',
  },
});

export const safeAreaViewStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

export const dividerStyles = StyleSheet.create({
  dividerTopWide: {
    marginTop: 32,
  },
});
