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

import { StackScreenProps } from '@react-navigation/stack';
import { Fonts } from 'react-native-paper/lib/typescript/types';
import { MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import {
  ImageSourcePropType,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type DetailItems = {
  character: { [key: string]: any };
  extLinks: { [key: string]: any };
};

export type MultiColumnCardProps = {
  title: string;
  name: string;
  subtitle: string;
  onPress?: () => void;
  source: string;
  style?: StyleProp<ViewStyle>;
};

export type DiscoverySectionProps = {
  requiresUpdate: number;
};

export type DiscoverySubSectionProps = {
  subSectionTitle: string;
  results: Dict[];
};

export type StackListCardProps = {
  id: number;
  title: string;
  name: string;
  subtitle: string;
  size: number;
  onPress?: () => void;
  source: ImageSourcePropType;
};

export type BasicInfoListProps = {
  results: Dict[];
  columns?: 1 | 2;
  renderItem: ListRenderItem<Dict> | null | undefined;
};

export type ListRenderItemProps = {
  item: Dict;
};

export type Dict = { [key: string]: any };

export type StackParamList = {
  Top: any;
  About: any;
  Settings: any;
  Detail: { basic_info: Dict; uri: string };
  WebView: { uri: string };
};

export type StackProps = StackScreenProps<StackParamList, 'Top'>;

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookmark: undefined;
  Settings: undefined;
};

export type BottomTabProps = MaterialBottomTabScreenProps<
  BottomTabParamList,
  'Home'
>;

// Copied from react-native-paper
type Mode = 'adaptive' | 'exact';

// Merged theme type from react-navigation and react-native-paper
export type Theme = {
  dark: boolean;
  mode?: Mode;
  roundness: number;
  colors: {
    primary: string;
    background: string;
    card: string;
    surface: string;
    accent: string;
    error: string;
    text: string;
    border: string;
    onSurface: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    notification: string;
  };
  fonts: Fonts;
  animation: {
    scale: number;
  };
};
