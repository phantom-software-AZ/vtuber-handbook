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
 * Search screen.
 *
 * @format
 * @flow strict-local
 */

import React, { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Dict, StackProps } from '../../types';
import { getBookmarkedList, sqliteDB } from '../common/utils';
import BasicInfoList from '../elements/BasicInfoList';
import { ListRenderItem } from './SearchScreen';
import { asyncStorageContext, dBContext } from '../../App';

const runDBQuery = async (
  names: string[],
  setResults: Function,
): Promise<any> => {
  // console.log(names);
  if (!names || names.length === 0) {
    setResults([]);
  } else {
    setResults(
      (await sqliteDB.querySelectedNames(names)).filter((item: Dict) => !!item),
    );
  }
};

const BookmarkScreen = ({ route, navigation }: StackProps) => {
  const [results, setResults] = React.useState<Dict[]>([]);
  const dBReady = useContext<boolean>(dBContext);
  const asyncStorageInfo = useContext<Dict>(asyncStorageContext);

  useEffect(() => {
    console.log('BookmarkScreen useEffect');
    let queryDone = false;

    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      if (dBReady) {
        getBookmarkedList().then(res => {
          runDBQuery(res, setResults);
          queryDone = true;
        });
      }
    });

    //This is for AsyncStorage update
    if (dBReady && !queryDone) {
      getBookmarkedList().then(res => runDBQuery(res, setResults));
    }

    return () => {
      console.log('BookmarkScreen useEffect clean');
      unsubscribe();
    };
  }, [dBReady, navigation, asyncStorageInfo.updated]);

  return (
    <SafeAreaView>
      <BasicInfoList
        results={results}
        renderItem={({ item }) => {
          return <ListRenderItem item={item} />;
        }}
      />
    </SafeAreaView>
  );
};

export default BookmarkScreen;
