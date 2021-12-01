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

import React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

const marked = require('marked');

const constants = {
  embeddedImages: false,
  charaDetailHeaderHeight: 300,
  sqliteTables: ['basic_info', 'character', 'ext_links'],
  maxQueryLengthEmbedded: 20,
  longContentThreshold: 450,
  bookmarkListKey: '@userdata_bookmark_names',
  maxDiscoveryCardNumber: 6,
};

const about = {
  fandom: `
    Textural materials in this application are gathered from the [Virtual YouTuber Wiki](https://virtualyoutuber.fandom.com) at Fandom and is licensed under the [Creative Commons Attribution-Share Alike License](https://creativecommons.org/licenses/by-sa/3.0/).
`,
  license: `
 VTuber Handbook 0.1.1 - A mobile directory of VTubers
    Copyright (C) 2021 AzureRain

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
`,
};

const redditConstants = {
  hotSortUrl: 'https://www.reddit.com/r/VirtualYoutubers/hot.json',
  headerImgUrl:
    'https://styles.redditmedia.com/t5_9y7rz/styles/bannerBackgroundImage_qglbg2o5qjg41.jpg',
};

const markedOptions = {
  renderer: new marked.Renderer(),
  gfm: true,
  breaks: true,
  smartLists: true,
  smartypants: true,
  xhtml: true,
};

const snackBarText = {
  addBookmark: 'Bookmark Added',
  removeBookmark: 'Bookmark removed',
};

const extLinksOrder: { [key: string]: number } = {
  official_channel: 1,
  twitch: 2,
  twitter: 3,
  official_site: 4,
  patreon: 5,
  facebook: 6,
  instagram: 7,
  pixiv: 8,
  booth: 9,
  marshmallow: 10,
};

const TopNavigationContainer = React.createRef<NavigationContainerRef>();

export default constants;
export {
  redditConstants,
  extLinksOrder,
  TopNavigationContainer,
  markedOptions,
  about,
  snackBarText,
};
