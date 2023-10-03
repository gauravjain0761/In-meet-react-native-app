import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Appearance,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { get } from 'lodash';
import ImageBrowser from '../components/ImageBrowser';

const colorScheme = Appearance.getColorScheme();
export default class ImageBrowserScreenNew extends Component {
  _getHeaderLoader = () => <ActivityIndicator size="small" color="#0580FF" />;

  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Selected ${0} files`,
      headerLeft: () => (
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text style={{ color: '#007AFF' }} onPress={() => this.props.navigation.goBack()}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
    });
  }

  imagesCallback = callback => {
    const { navigation, route } = this.props;
  console.log('selectId::::',route.params.selectid);

    this.props.navigation.setOptions({
      headerRight: () => this._getHeaderLoader(),
    });
    const backScreen = get(route, 'params.backScreen', '');
    callback
      .then(async photos => {
        const cPhotos = [];
        for (const photo of photos) {
          const pPhoto = await this._processImageAsync(photo.uri);
          cPhotos.push({
            uri: pPhoto.uri,
            name: photo.filename,
            type: 'image/jpg',
            id:route.params.selectid
          });
        }
        navigation.pop();
        navigation.navigate(backScreen, { photos: cPhotos });
      })
      .catch(e => console.log(e));
  };

  async _processImageAsync(uri) {
    const file = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1000 } }], {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return file;
  }

  _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return (
      <TouchableOpacity title="Done" onPress={onSubmit}>
        <Text
          style={{
            color: colorScheme === 'dark' ? 'white' : 'black',
          }}
          onPress={onSubmit}>
          Done
        </Text>
      </TouchableOpacity>
    );
  };

  updateHandler = (count, onSubmit) => {
    this.props.navigation.setOptions({
      title: `Selected ${count} files`,
      headerRight: () => this._renderDoneButton(count, onSubmit),
    });
  };

  renderSelectedComponent = number => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  render() {
    const { route } = this.props;
    const emptyStayComponent = <Text style={styles.emptyStay}>There are no images</Text>;
    const maxLength = get(route, 'params.maxLength', 4);
  

    return (
      <View style={[styles.flex, styles.container]}>
        <ImageBrowser
          max={maxLength}
          onChange={this.updateHandler}
          callback={this.imagesCallback}
          renderSelectedComponent={this.renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
  },
  emptyStay: {
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF',
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff',
  },
});
