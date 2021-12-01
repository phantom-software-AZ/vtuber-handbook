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
 * Settings screen. Wraps a ScrollView in a stack navigator.
 *
 * @format
 * @flow strict-local
 */

import React, { useContext, useEffect } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScaledSize,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { List, Card, DataTable } from 'react-native-paper';
import { RenderHTMLSource } from 'react-native-render-html';
import { sqliteDB, UnTokenizeKey } from '../common/utils';
import ExternalLinkSection from '../elements/ExternalLinkSection';
import constants, { markedOptions } from '../../config';
import { DetailItems, Dict, StackProps } from '../../types';
import { View } from 'react-native';
import { dBContext } from '../../App';

const windowSize: ScaledSize = Dimensions.get('window');
const marked = require('marked');
// Set options for Markdown parser
marked.setOptions(markedOptions);

const sortCharaResults = (
  queryResults: DetailItems,
  sortAscending: boolean,
) => {
  let frontArr: Dict[] = [],
    backArr: Dict[] = [];
  if (queryResults) {
    Object.keys(queryResults.character)
      .filter((key: string) => {
        return !!queryResults.character[key];
      })
      .sort((key1: string, key2: string) =>
        (sortAscending ? key1 < key2 : key2 < key1) ? 1 : -1,
      )
      .map((key: string) => {
        let obj: DetailItems['character'] = {};
        const untokenizedKey = UnTokenizeKey(key);
        const htmlSrc = marked.parseInline(queryResults.character[key]);
        obj[untokenizedKey] = htmlSrc;

        //Push long contents to the back pages
        htmlSrc.length < constants.longContentThreshold
          ? frontArr.push(obj)
          : backArr.push(obj);
      });
    return [...frontArr, ...backArr];
  } else {
    return [];
  }
};

const runDBQuery = async (
  name: string,
  sortAscending: boolean,
  setQueryResults: Function,
  setSortedCharaResults: Function,
): Promise<void> => {
  if (sqliteDB && sqliteDB.isReady()) {
    const items = await sqliteDB.queryCharaAndExtLinks(name);
    setQueryResults(items);

    //Sort items for table
    setSortedCharaResults(sortCharaResults(items, sortAscending));
  }
};

const CharaDetailScreen = ({ route, navigation }: StackProps) => {
  const dBReady = useContext<boolean>(dBContext);

  const uri = route.params?.uri;
  const [hheight, setHheight] = React.useState(
    constants.charaDetailHeaderHeight,
  );
  const [queryResults, setQueryResults] = React.useState<DetailItems | null>(
    null,
  );

  // DataTable
  const [sortedItems, setSortedItems] = React.useState([]);
  const [sortAscending] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([3, 5, 10, 50]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1],
  );
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, sortedItems.length);

  //HTML render
  const windowDims = useWindowDimensions();

  useEffect(() => {
    console.log('CharaDetailScreen On Effect');
    setPage(0);
    navigation.setOptions({
      title: route.params ? route.params.basic_info.name : 'Detail',
    });

    if (uri) {
      Image.getSize(
        uri,
        (srcWidth, srcHeight) => {
          const ratio = Math.min(
            windowSize.width / srcWidth,
            windowSize.height / 3 / srcHeight,
          );
          setHheight(srcHeight * ratio);
          // console.log(ratio);
        },
        error => {
          console.log(error);
        },
      );
    } else {
      setHheight(0);
    }

    //Run sqlite query
    if (dBReady) {
      runDBQuery(
        route.params?.basic_info.name,
        sortAscending,
        setQueryResults,
        setSortedItems,
      );
    }
    return () => {
      console.log('CharaDetailScreen Clean Effect');
    };
  }, [
    route.params?.basic_info.name,
    itemsPerPage,
    sortAscending,
    uri,
    dBReady,
  ]);

  const getDataTable = () => {
    return (
      <DataTable style={styles.listResetOffset}>
        {sortedItems.slice(from, to).map((item: DetailItems['character']) => {
          //We know there is only one key
          const key = Object.keys(item)[0];
          const value = item[key];
          return (
            <DataTable.Row key={key}>
              <DataTable.Cell style={styles.dataTableKeyColumn}>
                {key}
              </DataTable.Cell>
              <View style={styles.dataTableValueColumnContainer}>
                <View style={styles.dataTableValueColumn}>
                  <RenderHTMLSource
                    contentWidth={windowDims.width}
                    source={{
                      html: value,
                    }}
                  />
                </View>
              </View>
            </DataTable.Row>
          );
        })}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(sortedItems.length / itemsPerPage)}
          onPageChange={p => setPage(p)}
          label={`${from + 1}-${to} of ${sortedItems.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.scrollViewInner}>
          <Card.Cover
            source={{ uri: uri }}
            resizeMethod="scale"
            style={{
              flexDirection: 'column',
              height: hheight,
            }}
          />
          <ExternalLinkSection id={1} items={queryResults} />
          <List.Accordion
            title="Basic Information"
            left={props => (
              <List.Icon {...props} icon="format-list-bulleted" />
            )}>
            {getDataTable()}
          </List.Accordion>
          <List.Accordion
            title="Introduction"
            left={props => (
              <List.Icon {...props} icon="format-list-bulleted" />
            )}>
            <View style={styles.listResetOffsetNarrow}>
              <RenderHTMLSource
                contentWidth={windowDims.width}
                source={{
                  html: marked.parseInline(route.params?.basic_info.intro),
                }}
              />
            </View>
          </List.Accordion>
          <List.Accordion
            title="Visit Wiki Page"
            left={props => (
              <List.Icon {...props} icon="format-list-bulleted" />
            )}>
            <View style={styles.listResetOffsetNarrow}>
              <RenderHTMLSource
                contentWidth={windowDims.width}
                source={{
                  html: marked.parseInline(route.params?.basic_info.credit),
                }}
              />
            </View>
          </List.Accordion>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewInner: {
    paddingBottom: 15,
  },
  listResetOffset: {
    marginLeft: '-10%',
    width: '105%',
    justifyContent: 'flex-start',
  },
  listResetOffsetNarrow: {
    marginLeft: '-3%',
    width: '95%',
    justifyContent: 'flex-start',
  },
  dataTableKeyColumn: {
    flex: 2,
  },
  dataTableValueColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataTableValueColumnContainer: {
    flex: 3,
  },
});

export default CharaDetailScreen;
