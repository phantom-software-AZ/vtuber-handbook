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

import { DecodeImgOrLink, sqliteDB } from '../common/utils';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import {
  Dict,
  DiscoverySectionProps,
  DiscoverySubSectionProps,
} from '../../types';
import MultiColumnCardItem from './MultiColumnCardItem';
import { List, Title } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { dBContext } from '../../App';
import { useNavigation } from '@react-navigation/native';
import constants from '../../config';

const runDBAgenciesQuery = async (setResults: Function): Promise<any> => {
  setResults(await sqliteDB.queryAgencies());
};

const runDBRandomQuery = async (setResults: Function): Promise<any> => {
  setResults(await sqliteDB.queryRandomNames());
};

const DiscoverySubSection = (props: DiscoverySubSectionProps) => {
  const navigation = useNavigation();

  if (
    props.results &&
    props.results.length >= constants.maxDiscoveryCardNumber
  ) {
    return (
      <List.Section style={styles.listSection}>
        <Title>{props.subSectionTitle}</Title>
        <View style={styles.twoColumnContainer}>
          {(() => {
            const elements: Dict[] = [];
            props.results.reduce((accu: Dict, item: Dict) => {
              const data = DecodeImgOrLink(item);
              if (data === '') {
                return item;
              }
              elements.push(
                <MultiColumnCardItem
                  key={item.name}
                  name={item.name}
                  onPress={() => {
                    navigation.navigate('Detail', {
                      basic_info: item,
                      uri: data,
                    });
                  }}
                  source={data}
                  title={item.display_title}
                  subtitle={item.intro}
                  style={styles.twoColumnItems}
                />,
              );
              return item;
            });
            return elements.slice(
              0,
              Math.max(0, parseInt(String(elements.length / 2), 10) * 2),
            );
          })()}
        </View>
      </List.Section>
    );
  } else {
    return null;
  }
};

const DiscoverySection = (props: DiscoverySectionProps) => {
  const [angenciesResult, setAngenciesResult] = useState<Dict[]>([]);
  const [randomResult, setRandomResult] = useState<Dict[]>([]);
  const dBReady = useContext<boolean>(dBContext);

  useEffect(() => {
    console.log('Discovery Section Effect');

    if (dBReady) {
      runDBAgenciesQuery(setAngenciesResult);
      runDBRandomQuery(setRandomResult);
    }

    return () => {
      console.log('Discovery Section Effect clean');
    };
  }, [dBReady, props.requiresUpdate]);

  return (
    <>
      <DiscoverySubSection results={randomResult} subSectionTitle="VTubers" />
      <DiscoverySubSection
        results={angenciesResult}
        subSectionTitle="Agencies"
      />
    </>
  );
};

const styles = StyleSheet.create({
  listSection: {
    flex: 1,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-around',
  },
  twoColumnItems: {
    flex: 1,
    flexBasis: '40%',
    width: '40%',
    margin: '2%',
  },
});

export default DiscoverySection;
