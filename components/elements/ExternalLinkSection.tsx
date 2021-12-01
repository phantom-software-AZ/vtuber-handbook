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

import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { Dict } from '../../types';
import LinkButton from './LinkButton';
import { extLinksOrder } from '../../config';
import { ListItemStyles } from '../common/styles';

export interface ExternalLinkProps {
  id: number;
  items: any;
}

const GenerateLinkButtons = (ext_links: Dict) => {
  if (!ext_links) {
    return null;
  }
  const orderedKeys = Object.keys(ext_links).sort((a: string, b: string) =>
    extLinksOrder[a] > extLinksOrder[b] ? 1 : -1,
  );
  let buttonArray: JSX.Element[] = [];

  orderedKeys.map(elem => {
    if (elem === 'name') {
      //Skip the first column from query
      return;
    }
    const url = ext_links[elem];
    if (url) {
      buttonArray.push(
        <LinkButton
          key={orderedKeys.indexOf(elem)}
          buttonKey={elem}
          type={elem}
          url={url}
          style={styles.item}
        />,
      );
    }
  });
  return buttonArray;
};

const ExternalLinkSection = (props: ExternalLinkProps): JSX.Element | null => {
  const items = props.items;

  useEffect(() => {
    console.log('ExternalLinkSection useEffect');

    return () => {
      console.log('ExternalLinkSection useEffect clean');
    };
  }, []);

  if (!items) {
    return null;
  } else {
    return (
      <View key={props.id} style={[ListItemStyles.container, styles.container]}>
        {GenerateLinkButtons(items.extLinks)}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  item: {
    flex: 1,
    flexBasis: '44%',
    flexGrow: 0,
    flexShrink: 1,
    marginLeft: '4%',
    // marginRight: '2%',
    marginBottom: '4%',
  },
});

export default ExternalLinkSection;
