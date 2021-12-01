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
 * Helper functions for querying the pre-loaded SQLite database.
 *
 */

import SQLite from 'react-native-sqlite-storage';
import Fuse from 'fuse.js';
import constants from '../config';
import { Dict } from '../types';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

export interface QueryInfo {
  table: number;
  names?: string[];
}

class DBQuery {
  private db: any;
  public returnValue?: any;

  constructor() {
    this.returnValue = [];
  }

  errorCB = (err: string) => {
    console.log('error: ', err);
    return false;
  };

  successCB = () => {
    console.log('SQL executed ...');
  };

  openCB = () => {
    console.log('Database OPEN');
  };

  closeCB = () => {
    console.log('Database CLOSED');
  };

  isReady = () => {
    return this.db;
  };

  openDatabase = async () => {
    console.log('Opening database...');
    if (this.db) {
      console.warn('Previously opened connection not closed yet');
    }
    try {
      this.db = await SQLite.openDatabase({
        name: 'main',
        createFromLocation: '~/wiki-data.db',
      });
      this.openCB();
    } catch (err) {
      this.errorCB(err);
    }
    return this.db;
  };

  private prepareDatabase = async (queryFn: Function): Promise<any> => {
    console.log('Preparing database');

    if (!this.db) {
      console.warn('Database connection does not exist!');
      return Promise.resolve();
    }

    try {
      await this.db.executeSql('PRAGMA foreign_keys = ON', []);
      await this.transactionWrapper(queryFn);
    } catch (err) {
      console.log('Database not ready, ', err);
      // this.closeDatabase();
    }
  };

  private transactionWrapper = async (queryFn: Function) => {
    try {
      await this.db.transaction(queryFn);
      console.log('Processing completed');
    } catch (err) {
      this.errorCB(err);
    }
  };

  prepareAndQueryDB = async (queryFn: Function): Promise<any> => {
    await this.prepareDatabase(queryFn);
  };

  closeDatabase = () => {
    if (this.db) {
      console.log('Closing database ...');
      this.db.close(this.closeCB, this.errorCB);
      this.db = undefined;
    } else {
      console.log('Database was not OPENED');
    }
  };

  private queryBasic = (tx: any, info: QueryInfo): Promise<any> => {
    console.log('Executing queries...');

    return tx.executeSql(
      `SELECT * FROM ${constants.sqliteTables[info.table]} t`,
      [],
    );
  };

  private buildSingleRecordQuery = (tx: any, info: QueryInfo) => {
    console.log('Executing single record queries...');
    if (!info.names || info.names.length < 1) {
      return {};
    }

    const query = `SELECT * FROM ${
      constants.sqliteTables[info.table]
    } t WHERE t.name = ?`;

    return tx.executeSql(query, !info.names ? [] : [info.names[0]]);
  };

  private buildAllByNameQuery = async (tx: any, info: QueryInfo) => {
    console.log('Executing queries...');

    let paramStr;
    if (info.names) {
      // Build parameterized query
      const len = info.names.length;
      paramStr = Array(len).fill('?').join(',');
    }

    const query = !info.names
      ? `SELECT name FROM ${constants.sqliteTables[info.table]} t`
      : `SELECT * FROM ${
          constants.sqliteTables[info.table]
        } t WHERE t.name IN (${paramStr})`;

    return await tx.executeSql(query, !info.names ? [] : info.names);
  };

  private buildAgenciesQuery = (tx: any) => {
    console.log('Executing sorted agencies queries...');

    const query =
      'SELECT i.name,is_agency,profile_img,profile_img_link,intro,display_title,credit FROM basic_info' +
      ' AS i INNER JOIN character AS c ON i.name == c.name WHERE i.is_agency == 1 AND LOWER(i.name) IN' +
      ' (SELECT DISTINCT LOWER(affiliation) FROM character) ORDER BY RANDOM() LIMIT 20';

    return tx.executeSql(query);
  };

  private buildRandomNamesQuery = (tx: any) => {
    console.log('Executing random names queries...');

    const query =
      'SELECT * FROM basic_info WHERE is_agency == 0 AND name IN' +
      ' (SELECT name FROM basic_info ORDER BY RANDOM() LIMIT 20)';

    return tx.executeSql(query);
  };

  queryBasicByFuzzyNames = async (text: string): Promise<any> => {
    console.log('Starting SQLite Fuzzy Names query');
    const allNames = await this.queryAllNames();

    const result = this.fuseSearch(allNames, text);

    return await this.querySelectedNames(result);
  };

  querySelectedNames = async (result: string[]) => {
    let returnValue: Dict[] = [];
    let results: any;
    try {
      await this.transactionWrapper(async (tx: any) => {
        results = (
          await this.buildAllByNameQuery(tx, {
            table: 0,
            names: result,
          })
        )[1];
        console.log('Selected names query completed');
      });
      const len = results.rows.length;
      returnValue = Array(len);
      let idx, row;
      for (let i = 0; i < len; i++) {
        row = results.rows.item(i);
        idx = result.indexOf(row.name);
        returnValue[idx] = row;
        returnValue[idx].id = idx;
      }
    } catch (err) {
      this.errorCB(err);
    }
    return returnValue;
  };

  queryAllNames = async () => {
    let allNames: string[];
    let results: any;

    const queryFn = async (tx: any) => {
      try {
        results = (
          await this.buildAllByNameQuery(tx, {
            table: 0,
          })
        )[1];
        console.log('All names query completed');
      } catch (err) {
        this.errorCB(err);
      }
    };
    try {
      await this.transactionWrapper(queryFn);
    } catch (err) {
      this.errorCB(err);
    }
    const len = results.rows.length;
    allNames = Array(len);
    // console.log(len);
    for (let i = 0; i < len; i++) {
      allNames[i] = results.rows.item(i).name;
    }
    // console.log(allNames);
    return allNames;
  };

  fuseSearch = (allNames: string[], text: string) => {
    // Fuse fuzzy search
    const options = {
      includeScore: false,
      minMatchCharLength: 1,
      includeMatches: false,
      distance: 45,
      threshold: 0.4,
    };
    const fuse = new Fuse(allNames, options);
    let result = fuse.search(text).map(x => {
      return x.item;
    });

    // Impose a maximum number of items for embedded version
    if (constants.embeddedImages) {
      result = result.slice(
        0,
        Math.min(result.length, constants.maxQueryLengthEmbedded),
      );
    }
    return result;
  };

  queryCharaAndExtLinks = async (text: string): Promise<any> => {
    console.log('Starting SQLite Details query');

    let results = [];

    for (let i = 1; i < 3; i++) {
      let result: any;
      const queryFn = async (tx: any) => {
        try {
          result = (
            await this.buildSingleRecordQuery(tx, {
              table: i,
              names: [text],
            })
          )[1];
        } catch (err) {
          this.errorCB(err);
        }
      };
      try {
        await this.prepareAndQueryDB(queryFn);
      } catch (err) {
        this.errorCB(err);
      }
      if (result) {
        let len = Math.min(result.rows.length, 1);
        for (let j = 0; j < len; j++) {
          results.push(result.rows.item(j));
        }
      } else {
        results.push(undefined);
      }
      // console.log(results);
    }

    return { character: results[0], extLinks: results[1] };
  };

  queryAgencies = async (): Promise<any> => {
    console.log('Starting SQLite Agencies query');

    let results = [];

    let result: any;
    const queryFn = async (tx: any) => {
      try {
        result = (await this.buildAgenciesQuery(tx))[1];
      } catch (err) {
        this.errorCB(err);
      }
    };
    try {
      await this.prepareAndQueryDB(queryFn);
    } catch (err) {
      this.errorCB(err);
    }
    if (result) {
      let len = result.rows.length;
      for (let i = 0; i < len; i++) {
        results.push(result.rows.item(i));
      }
    }
    // console.log(results);

    return results;
  };

  queryRandomNames = async (): Promise<any> => {
    console.log('Starting SQLite Random Names query');

    let results = [];

    let result: any;
    const queryFn = async (tx: any) => {
      try {
        result = (await this.buildRandomNamesQuery(tx))[1];
      } catch (err) {
        this.errorCB(err);
      }
    };
    try {
      await this.prepareAndQueryDB(queryFn);
    } catch (err) {
      this.errorCB(err);
    }
    if (result) {
      let len = result.rows.length;
      for (let i = 0; i < len; i++) {
        results.push(result.rows.item(i));
      }
    }
    // console.log(results);

    return results;
  };
}

export default DBQuery;
