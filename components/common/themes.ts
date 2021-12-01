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
 * Merged theme from react-navigation and react-native-paper.
 */
import { Theme } from '../../types';
import { configureFonts } from 'react-native-paper';

export const DefaultTheme: Theme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: 'rgb(0, 122, 255)',
    accent: 'rgb(3,218,196)',
    background: 'rgb(242, 242, 242)',
    surface: 'rgb(255,255,255)',
    error: 'rgb(176,0,32)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    onSurface: 'rgb(0,0,0)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    placeholder: 'rgba(0, 0, 0, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

export const DarkTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptive',
  colors: {
    primary: 'rgb(10, 132, 255)',
    accent: 'rgb(3,218,198)',
    background: 'rgb(1, 1, 1)',
    surface: 'rgb(18,18,18)',
    error: 'rgb(207,102,121)',
    onSurface: 'rgb(255,255,255)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    disabled: 'rgba(255, 255, 255, 0.38)',
    placeholder: 'rgba(255, 255, 255, 0.54)',
    backdrop: 'rgba(255, 255, 255, 0.5)',
    notification: 'rgb(255, 69, 58)',
  },
};
