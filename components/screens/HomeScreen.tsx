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

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { BottomTabProps } from '../../types';
import { View } from 'react-native';
import _ from 'lodash';
import { redditConstants } from '../../config';
import { Card, Divider, Headline, Paragraph, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DiscoverySection from '../elements/DiscoverySection';
import { dividerStyles } from '../common/styles';

/**
 * Get post from reddit
 */
const getRedditWeeklySpotlight = async (data: boolean): Promise<any> => {
  console.log('getRedditWeeklySpotlight');

  const getHotFromApiAsync = async () => {
    try {
      const response = await fetch(redditConstants.hotSortUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      return json.data.children;
    } catch (error) {
      console.error('GET request error: ', error);
    }
  };

  let hotList;
  let ret = '';
  try {
    hotList = (await getHotFromApiAsync()).filter((item: any) => {
      return new RegExp('Weekly VTuber Spotlight').test(item.data.title);
    });
    if (!data) {
      ret = _.unescape(hotList[0].data.selftext_html);
    } else {
      ret = hotList[0].data;
    }
    // console.log(ret);
  } catch (e) {
    console.error('Reddit read error ', e);
  }

  return ret;
};

const HomeScreen = ({ route, navigation }: BottomTabProps) => {
  const topNav = useNavigation();

  const [redditTitle, setRedditTitle] = useState<string | undefined>(undefined);
  const [redditSubTitle, setRedditSubTitle] = useState<string | undefined>(
    undefined,
  );
  const [redditUrl, setRedditUrl] = useState<string | undefined>(undefined);
  const [requiresUpdate, setRequiresUpdate] = useState<number>(0);

  const debouncedRedditRequestFn = _.debounce(
    async () => {
      console.log('HomeScreen Reddit API debounce call');
      setRequiresUpdate(
        requiresUpdate >= Math.pow(2, 29) ? 0 : requiresUpdate + 1,
      );

      const data = await getRedditWeeklySpotlight(true);
      const [title, subtitle] = data?.title.split(':');
      setRedditTitle(title.trim());
      setRedditSubTitle(subtitle.trim());
      setRedditUrl(data?.url);
    },
    1000,
    {
      leading: true,
      maxWait: 5000,
      trailing: false,
    },
  );

  useEffect(() => {
    console.log('HomeScreen On Effect');

    const unsubscribe = navigation.addListener('focus', async () => {
      // The screen is focused
      debouncedRedditRequestFn();
    });

    return () => {
      console.log('HomeScreen Clean Effect');
      unsubscribe();
    };
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View key="Weekly Spotlight" style={styles.scrollViewInner}>
          <Card
            onPress={() => {
              topNav.navigate('WebView', { uri: redditUrl });
            }}>
            <Card.Cover source={{ uri: redditConstants.headerImgUrl }} />
            <Card.Content style={styles.scrollViewInner}>
              <Title>{redditTitle}</Title>
              <Paragraph>{redditSubTitle}</Paragraph>
            </Card.Content>
          </Card>
          <Divider style={dividerStyles.dividerTopWide} />
          <Headline style={styles.titleWrapper}>Discovery</Headline>
          <DiscoverySection requiresUpdate={requiresUpdate} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewInner: {
    marginTop: 12,
    marginHorizontal: 8,
    paddingBottom: 15,
  },
  titleWrapper: {
    marginTop: 16,
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

export default HomeScreen;
