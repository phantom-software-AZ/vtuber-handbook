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

import DBQuery from '../../scripts/sqlite_helper';
import { Dict } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../config';
import pako from 'pako';

const Buffer = require('buffer/').Buffer;

const objectMap = (obj: Dict, mapFn: Function) => {
  return Object.keys(obj).reduce((result: Dict, key: string) => {
    result[key] = mapFn(obj[key]);
    return result;
  }, {});
};

const DecodeImgOrLink = (item: Dict) => {
  // Decode gzip and base64 encode
  if (constants.embeddedImages) {
    const byteArray = Buffer.from(item.profile_img, 'base64');
    const inflated = pako.inflate(byteArray);
    if (!inflated) {
      return '';
    } else {
      return `data:image/jpeg;base64,${Buffer.from(inflated).toString(
        'base64',
      )}`;
    }
  } else {
    return item.profile_img_link;
  }
};

//Singleton connection to sqlite. react-native-sqlite-storage doesn't handle continuous open/close very well
let sqliteDB: any;

const InitSqliteDB = async () => {
  if (!sqliteDB || !sqliteDB.isReady()) {
    sqliteDB = new DBQuery();
    await sqliteDB.openDatabase();
  }
};

const UnInitSqliteDB = () => {
  if (sqliteDB && sqliteDB.isReady()) {
    sqliteDB.closeDatabase();
    sqliteDB = undefined;
  }
};

/**
 * Regex for replaceAll. React doesn't target ESNext yet.
 * @param target The string to search
 * @param search Search string
 * @param replacement Replacement string
 */
const stringReplaceAll = (
  target: string,
  search: string,
  replacement: string,
) => {
  return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Counterpart of python function that generates keys
 * @param key
 * @constructor
 */
const UnTokenizeKey = (key: string): string => {
  const newKey = stringReplaceAll(key, '_', ' ');
  const words = newKey.split(' ');

  return words
    .map(word => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');
};

/**
 * Utility functions for bookmark lists
 */
const bookmarkedListAppend = async (name: string) => {
  console.log('bookmarkedListAppend');
  try {
    const bookmarkListData = await AsyncStorage.getItem(
      constants.bookmarkListKey,
    );
    let bookmarkList: string[] = [];
    if (bookmarkListData) {
      bookmarkList = JSON.parse(bookmarkListData);
    }
    if (!bookmarkList.includes(name)) {
      bookmarkList.push(name);
    }
    await AsyncStorage.setItem(
      constants.bookmarkListKey,
      JSON.stringify(bookmarkList),
    );
  } catch (e) {
    console.log('Async Storage Error: ', e);
  }
};

const bookmarkedListRemove = async (name: string) => {
  console.log('bookmarkedListRemove');
  try {
    const bookmarkListData = await AsyncStorage.getItem(
      constants.bookmarkListKey,
    );
    let bookmarkList: string[] = [];
    if (bookmarkListData) {
      bookmarkList = JSON.parse(bookmarkListData);
    }
    bookmarkList = bookmarkList.filter(item => item !== name);
    await AsyncStorage.setItem(
      constants.bookmarkListKey,
      JSON.stringify(bookmarkList),
    );
  } catch (e) {
    console.log('Async Storage Error: ', e);
  }
};

const getBookmarkedList = async (): Promise<string[]> => {
  try {
    const bookmarkListData = await AsyncStorage.getItem(
      constants.bookmarkListKey,
    );
    if (bookmarkListData) {
      return JSON.parse(bookmarkListData);
    } else {
      return [];
    }
  } catch (e) {
    console.log('Async Storage Error: ', e);
  }
  return [];
};

export { sqliteDB, InitSqliteDB, UnInitSqliteDB };
export { objectMap, DecodeImgOrLink };
export { stringReplaceAll, UnTokenizeKey };
export { bookmarkedListAppend, bookmarkedListRemove, getBookmarkedList };
