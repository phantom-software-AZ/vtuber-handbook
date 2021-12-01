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
 * Card item that is used in nulti column lists.
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Caption, Card, Title } from 'react-native-paper';
import { MultiColumnCardProps } from '../../types';
import { StyleSheet } from 'react-native';

const MultiColumnCardItem = (props: MultiColumnCardProps): JSX.Element => {
  return (
    <Card onPress={props.onPress} style={props.style}>
      <Card.Cover
        source={{ uri: props.source }}
        resizeMode="contain"
        style={styles.cover}
      />
      <Card.Content>
        <Title numberOfLines={1}>{props.title}</Title>
        <Caption numberOfLines={5}>{props.subtitle}</Caption>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  cover: {
    backgroundColor: 'rgb(255,255,255)',
  },
});

export default MultiColumnCardItem;
