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
import React, { useContext } from 'react';
import { Searchbar } from 'react-native-paper';
import _ from 'lodash';
import { sqliteDB } from '../common/utils';
import { dBContext } from '../../App';

export interface SearchTextInputProps {
  id: number;
  placeholder?: string;
  onSearchResultsChange: Function;
}

const runDBQuery = async (text: string): Promise<any> => {
  if (!text) {
    return [];
  } else if (sqliteDB && sqliteDB.isReady()) {
    return await sqliteDB.queryBasicByFuzzyNames(text);
  } else {
    return [];
  }
};

const SearchTextInput = (props: SearchTextInputProps): JSX.Element => {
  const dBReady = useContext<boolean>(dBContext);
  const [text, setText] = React.useState('');

  const debouncedTextHandler = _.debounce(
    (t: string) => {
      console.log('debounce call');
      if (dBReady) {
        runDBQuery(t).then(res => props.onSearchResultsChange(res));
      }
    },
    150,
    {
      leading: true,
      maxWait: 1000,
      trailing: true,
    },
  );

  return (
    <View key={props.id} style={styles.container}>
      <Searchbar
        value={text}
        onChangeText={t => {
          setText(t);
          debouncedTextHandler(t);
        }}
        placeholder={props.placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
});

export default SearchTextInput;
