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
 * List item that navigate to a new screen (stack navigation).
 *
 * @format
 * @flow strict-local
 */

import { StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import {
  Avatar,
  Card,
  IconButton,
  Menu,
  Portal,
  Snackbar,
} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { bookmarkedListAppend, bookmarkedListRemove } from '../common/utils';
import { Dict, StackListCardProps } from '../../types';
import { snackBarText } from '../../config';
import { asyncStorageContext } from '../../App';
import { ListItemStyles } from '../common/styles';

function notifyAsyncStorageUpdate(asyncStorageInfo: Dict) {
  asyncStorageInfo.updateStatus(
    asyncStorageInfo.updated >= Math.pow(2, 29)
      ? 0
      : asyncStorageInfo.updated + 1,
  );
  // console.log(asyncStorageInfo.updated);
}

const StackListCardItem = (props: StackListCardProps): JSX.Element => {
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [snackBarVisible, setSnackBarVisible] = React.useState<boolean>(false);
  const [snackBarContent, setSnackBarContent] = React.useState<string>('');
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const onToggleSnackBar = () => setSnackBarVisible(!snackBarVisible);
  const onDismissSnackBar = () => setSnackBarVisible(false);
  const asyncStorageInfo = useContext<Dict>(asyncStorageContext);

  const onAddBookmark = async () => {
    setSnackBarContent(snackBarText.addBookmark);
    onToggleSnackBar();
    closeMenu();
    await bookmarkedListAppend(props.name);
    notifyAsyncStorageUpdate(asyncStorageInfo);
  };

  const onRemoveBookmark = async () => {
    setSnackBarContent(snackBarText.removeBookmark);
    onToggleSnackBar();
    closeMenu();
    await bookmarkedListRemove(props.name);
    notifyAsyncStorageUpdate(asyncStorageInfo);
  };

  return (
    <View key={props.id} style={[ListItemStyles.container]}>
      <Portal>
        <Snackbar
          style={styles.snackbarContainer}
          duration={1000}
          visible={snackBarVisible}
          onDismiss={onDismissSnackBar}>
          {snackBarContent}
        </Snackbar>
      </Portal>
      <Card onPress={props.onPress}>
        <Card.Title
          title={props.title}
          subtitle={props.subtitle}
          left={() => (
            <Avatar.Image
              size={props.size}
              theme={OverrideTheme}
              source={props.source}
            />
          )}
          right={() => (
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon={() => <MaterialIcons name="more-vert" size={24} />}
                  onPress={openMenu}
                />
              }>
              <Menu.Item onPress={onAddBookmark} title="Add to bookmark" />
              <Menu.Item onPress={onRemoveBookmark} title="Remove bookmark" />
            </Menu>
          )}
        />
      </Card>
    </View>
  );
};

const OverrideTheme = {
  colors: {
    primary: 'rgb(242, 242, 242)',
  },
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    bottom: 56,
    zIndex: 0,
  },
});

export default StackListCardItem;
