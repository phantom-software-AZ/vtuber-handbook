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
 * List item that navigate to a new screen (stack navigation).
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { ListItemStyles } from '../common/styles';
import { List } from 'react-native-paper';

export interface StackNavProps {
  title: string;
  onPress: () => void;
  description: string;
}

const StackNavListItem = (props: StackNavProps): JSX.Element => {
  return (
    <List.Item
      style={ListItemStyles.container}
      onPress={() => props.onPress()}
      title={props.title}
      description={props.description}
    />
  );
};

export default StackNavListItem;
