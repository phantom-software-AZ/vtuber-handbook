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

import React from 'react';
import { SafeAreaView } from 'react-native';
import SearchTextInput from '../elements/SearchScreenTextInput';
import Fuse from 'fuse.js';
import { Dict, ListRenderItemProps, StackProps } from '../../types';
import { useNavigation } from '@react-navigation/native';
import StackListCardItem from '../elements/StackListCardItem';
import BasicInfoList from '../elements/BasicInfoList';
import { DecodeImgOrLink } from '../common/utils';
import { safeAreaViewStyles } from '../common/styles';

/**
 * Render items from query results.
 * @param props Contains query results from basic_info
 * @constructor
 */
const ListRenderItem = (props: ListRenderItemProps): JSX.Element => {
  const navigation = useNavigation();
  const data = DecodeImgOrLink(props.item);
  const uri = data === '' ? undefined : data;

  return (
    <StackListCardItem
      id={2}
      title={props.item.display_title}
      name={props.item.name}
      subtitle={props.item.intro}
      size={48}
      onPress={() => {
        navigation.navigate('Detail', { basic_info: props.item, uri: uri });
      }}
      source={{ uri: uri }}
    />
  );
};

const SearchScreen = ({ route, navigation }: StackProps) => {
  const [results, setResults] = React.useState<Dict[]>([]);

  const onSearchResultsChange = (res: Fuse.FuseResult<string>[]): void => {
    // console.log(res);
    res = res.filter(x => x || x === false);
    setResults(res !== undefined ? res : []);
  };

  return (
    <SafeAreaView style={safeAreaViewStyles.safeAreaView}>
      <SearchTextInput
        id={0}
        placeholder="Who's in your mind?"
        onSearchResultsChange={onSearchResultsChange}
      />
      <BasicInfoList
        results={results}
        renderItem={({ item }) => {
          return <ListRenderItem item={item} />;
        }}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
export { ListRenderItem };
