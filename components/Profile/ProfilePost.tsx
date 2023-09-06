import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Row, Col } from 'react-native-responsive-grid-system';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { get } from 'lodash';
import { SubTitleOne } from '../common/Text';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState, useAppDispatch } from '../../store';
import { selectToken, selectUserId } from '~/store/userSlice';
import { userApi } from '~/api/UserAPI';
import { Blog, updateCurrentId } from '~/store/forumSlice';

const { width, height } = Dimensions.get('window');

const useStyles = makeStyles(theme => ({
  text: {
    color: theme.colors?.white,
    paddingHorizontal: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  rowTitle: { color: theme.colors?.white, width: 60 },
  personalTitle: {
    color: theme.colors?.black4,
    paddingTop: 20,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },
  interestChipContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: 10,
  },
  interestButtonContainer: {
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  interestButton: { width: (width - 96) / 5, height: 18, padding: 0 },
  interestButtonTitle: {
    color: theme.colors?.black4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageWrapper: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'column',
    position: 'relative',
    borderRadius: 5,
    overflow: 'hidden',
  },
  bottomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  bottomRightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
}));

function ProfilePhotoItem(props: { data: Blog }) {
  const { data } = props;
  const styles = useStyles();

  const isLocked = data.isHidden;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const handlePressImage = (isLocked: boolean, item = {}) => {
    const { blogId } = item;

    dispatch(updateCurrentId(blogId));
    navigation.push('ForumDetailScreen');
  };

  const renderItem = () => {
    return (
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          onPress={() => handlePressImage(isLocked, { blogId: data.id })}
          activeOpacity={isLocked ? 1 : 0.2}>
          <Image
            blurRadius={0}
            style={styles.image}
            source={{
              uri:
                get(data.photo?.split(','), '[0]', '') ||
                `https://via.placeholder.com/200x300?text=None`,
            }}
          />
        </TouchableOpacity>

        {isLocked && (
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -25 }, { translateY: -25 }],
            }}>
            {mapIcon.lockIcon({ color: 'white', size: 50 })}
          </View>
        )}
      </View>
    );
  };
  return renderItem();
}

export default function ProfilePost(props) {
  const styles = useStyles();

  const currentUserId = useSelector(selectUserId);
  const token = useSelector(selectToken);

  const { data: blogList } = useQuery(['fetchProfileBlogs', currentUserId], () =>
    userApi.fetchUserBlogs({ token, id: currentUserId }),
  );

  const navigation = useNavigation();
  const { theme } = useTheme();

  const renderItem = item => {
    return <ProfilePhotoItem data={item} />;
  };

  if (blogList?.records.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <SubTitleOne style={{ textAlign: 'center', ...styles.interestButtonTitle }}>
            您尚未發布任何動態
          </SubTitleOne>
        </View>
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={{ paddingHorizontal: 8, paddingTop: 10 }}>
        <Row rowStyles={{ marginRight: -10 }}>
          {blogList?.records.map(item => (
            <Col colStyles={{ paddingRight: 10 }} key={item.id} xs={4} sm={4} md={4} lg={4}>
              {renderItem(item)}
            </Col>
          ))}
        </Row>
      </View>
    </ScrollView>
  );
}
