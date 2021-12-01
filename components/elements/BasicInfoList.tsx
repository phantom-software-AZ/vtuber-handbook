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

import { FlatList } from 'react-native';
import React from 'react';
import { BasicInfoListProps } from '../../types';
import { ListItemStyles } from "../common/styles";

const BasicInfoList = (props: BasicInfoListProps) => {
  if (props.results) {
    return (
      <FlatList
        data={props.results}
        keyExtractor={(item: any, index: number): string => {
          return item.id.toString();
        }}
        renderItem={props.renderItem}
        numColumns={props.columns}
        style={
          (props.columns ?? 1) > 1
            ? [ListItemStyles.halfWidth, ListItemStyles.cardMarginCancel]
            : null
        }
      />
    );
  } else {
    return null;
  }
};

export default BasicInfoList;
