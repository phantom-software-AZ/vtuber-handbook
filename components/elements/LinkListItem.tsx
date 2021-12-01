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
 * List item that open a link in browser.
 *
 * @format
 * @flow strict-local
 */

import { Linking } from 'react-native';
import React from 'react';
import { ListItemStyles } from '../common/styles';
import { List } from 'react-native-paper';

export interface LinkProps {
  title: string;
  url: string;
  description: string;
}

const LinkListItem = (props: LinkProps): JSX.Element => {
  return (
    <List.Item
      style={ListItemStyles.container}
      onPress={() => {
        Linking.canOpenURL(props.url).then(supported => {
          if (supported) {
            Linking.openURL(props.url);
          } else {
            console.log('Device does not know how to open URI: ' + props.url);
          }
        });
      }}
      title={props.title}
      description={props.description}
    />
  );
};

export default LinkListItem;
