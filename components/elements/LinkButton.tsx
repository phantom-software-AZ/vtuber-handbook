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

import { Linking, StyleProp, useColorScheme, ViewStyle } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { UnTokenizeKey } from '../common/utils';

export interface LinkButtonProps {
  buttonKey: string;
  type: string;
  url: string;
  style: StyleProp<ViewStyle>;
}

export interface buttonStyleMapType {
  mode: 'text' | 'outlined' | 'contained';
  title: string;
  icon: JSX.Element | null;
  backgroundColor: string;
}

const buttonStyleMap = (
  type: string,
  url: string,
): buttonStyleMapType | null => {
  /**
   * YouTube logo can be used in apps as long as it is pointed to its website.
   * Twitch requires its logo followed by channel name.
   * Do not include Discord since they require written approval.
   * pixiv, booth, marshmallow don't have branding guidelines.
   */
  const mode = 'contained';
  const backgroundColor = '#f5f5f5'; //TODO: dark mode
  const iconSize = 18;
  switch (type.trim().toLowerCase()) {
    //YouTube
    case 'official_channel':
      return {
        mode: mode,
        title: 'YouTube',
        icon: (
          <FontAwesome5Icon name="youtube" color="#FF0000" size={iconSize} />
        ),
        backgroundColor: backgroundColor,
      };
    case 'secondary_official_channel':
      return {
        mode: mode,
        title: 'Secondary',
        icon: null,
        backgroundColor: backgroundColor,
      };
    case 'twitch':
      const channel = url.match('twitch.tv/(\\w*)/.*');
      if (channel) {
        return {
          mode: mode,
          title: channel[1],
          icon: (
            <FontAwesome5Icon name="twitch" color="#9146FF" size={iconSize} />
          ),
          backgroundColor: backgroundColor,
        };
      } else {
        return null;
      }
    case 'twitter':
      return {
        mode: mode,
        title: 'Twitter',
        icon: (
          <FontAwesome5Icon name="twitter" color="#1D9BF0" size={iconSize} />
        ),
        backgroundColor: backgroundColor,
      };
    case 'facebook':
      return {
        mode: mode,
        title: 'Facebook',
        icon: (
          <FontAwesome5Icon name="facebook" color="#1877F2" size={iconSize} />
        ),
        backgroundColor: backgroundColor,
      };
    case 'instagram':
      return {
        mode: mode,
        title: 'Instagram',
        // Cannot do gradient, so use black version
        icon: (
          <FontAwesome5Icon name="instagram" color="black" size={iconSize} />
        ),
        backgroundColor: backgroundColor,
      };
    case 'patreon':
      return {
        mode: mode,
        title: 'Patreon',
        icon: (
          <FontAwesome5Icon name="patreon" color="#FF424D" size={iconSize} />
        ),
        backgroundColor: backgroundColor,
      };
    case 'discord':
      return null;
    default:
      //Text only for the rest
      return {
        mode: mode,
        title: type && UnTokenizeKey(type),
        icon: null,
        backgroundColor: backgroundColor,
      };
  }
};

const LinkButton = (props: LinkButtonProps): JSX.Element | null => {
  const isDarkMode = useColorScheme() === 'dark';
  const buttonStyle = buttonStyleMap(props.type, props.url);
  if (buttonStyle) {
    return (
      <Button
        key={props.buttonKey}
        compact={true}
        uppercase={false}
        icon={() => buttonStyle.icon}
        style={props.style}
        mode={buttonStyle.mode}
        dark={isDarkMode}
        onPress={() => {
          Linking.canOpenURL(props.url).then(supported => {
            if (supported) {
              Linking.openURL(props.url);
            } else {
              console.log('Device does not know how to open URI: ' + props.url);
            }
          });
        }}
        color={buttonStyle.backgroundColor}>
        {buttonStyle.title}
      </Button>
    );
  } else {
    return null;
  }
};

export default LinkButton;
