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
 * About screen.
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import ColorStyles from '../common/colors';
import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { StackProps } from '../../types';
import { Headline, Surface } from 'react-native-paper';
import { RenderHTMLSource } from 'react-native-render-html';
import { about, markedOptions } from '../../config';

const marked = require('marked');
// Set options for Markdown parser
marked.setOptions(markedOptions);

const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Headline style={styles.header}>{title}</Headline>
      <Surface style={styles.innerContainer}>{children}</Surface>
    </View>
  );
};

const AboutLicenseScreen = ({ route, navigation }: StackProps) => {
  const backgroundColor =
    useColorScheme() === 'dark'
      ? ColorStyles.backgroundDarker
      : ColorStyles.backgroundLighter;

  //HTML render
  const windowDims = useWindowDimensions();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundColor}>
      <View style={[backgroundColor, styles.topContainer]}>
        <Section title="Credits">
          <RenderHTMLSource
            contentWidth={windowDims.width}
            source={{
              html: marked.parseInline(about.fandom),
            }}
          />
        </Section>
        <Section title="Licenses">
          <RenderHTMLSource
            contentWidth={windowDims.width}
            source={{
              html: marked.parseInline(about.license),
            }}
          />
        </Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    paddingBottom: 16,
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 16,
  },
  innerContainer: {
    backgroundColor: '#d2d2d2',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
});

export default AboutLicenseScreen;
