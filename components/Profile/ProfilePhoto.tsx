import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Row, Col } from 'react-native-responsive-grid-system';
import { Menu } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BodyThree, CaptionFive, CaptionFour, SubTitleOne } from '../common/Text';
import { ButtonTypeTwo, UnChosenButton } from '../common/Button';
import { mapIcon } from '../../constants/IconsMapping';
import { RootState, useAppDispatch } from '../../store';
import { UN_KNOWN } from '../../constants/defaultValue';
import { EducationValue, ReligionValue } from '../../constants/mappingValue';
import ProfileContactDetail from './ProfileContactDetail';
import { selectToken, selectUserId } from '~/store/userSlice';
import { FileRecord, userApi } from '~/api/UserAPI';
import { Blog } from '~/store/forumSlice';

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

function ProfilePhotoItem(props: { data: FileRecord; onPressPhoto: () => void }) {
  const { data, onPressPhoto } = props;
  const styles = useStyles();

  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const isLocked = data.isLock;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: lockPhoto, isLoading: isLockPhotoLoading } = useMutation(userApi.lockPhoto, {
    onSuccess: data => {},
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries(['fetchProfilePhotos', userId]);
    },
  });
  const { mutate: deletePhoto, isLoading: isDeletePhotoLoading } = useMutation(
    userApi.deletePhoto,
    {
      onSuccess: data => {},
      onError: () => {},
      onSettled: () => {
        queryClient.invalidateQueries(['fetchProfilePhotos', userId]);
      },
    },
  );
  const { mutate: unLockPhoto, isLoading: isUnLockPhotoLoading } = useMutation(
    userApi.unLockPhoto,
    {
      onSuccess: data => {},
      onError: () => {},
      onSettled: () => {
        queryClient.invalidateQueries(['fetchProfilePhotos', userId]);
      },
    },
  );
  const openMenu = () => {
    setVisible(true);
  };
  const closeMenu = () => {
    setVisible(false);
  };

  const handlePressImage = () => {
    onPressPhoto();
  };

  const itemStyle = {
    height: 32,
    borderBottomEndRadius: 20,
    paddingHorizontal: 5,
    borderBottomStartRadius: 20,
  };

  const handleLockPhoto = () => {
    if (isLockPhotoLoading) return;
    lockPhoto({
      token,
      photoId: data.id,
    });
    closeMenu();
  };
  const handleUnLockPhoto = () => {
    if (isUnLockPhotoLoading) return;
    unLockPhoto({
      token,
      photoId: data.id,
    });
    closeMenu();
  };
  const handleDeletePhoto = () => {
    if (isDeletePhotoLoading) return;
    deletePhoto({
      token,
      photoId: data.id,
    });
    closeMenu();
  };

  const renderMoreButton = () => {
    return (
      <Menu
        contentStyle={{
          backgroundColor: theme.colors.black2,
          borderRadius: 20,
          paddingVertical: 0,
        }}
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu}>
            {mapIcon.more({ size: 20, color: theme.colors.black4 })}
          </TouchableOpacity>
        }>
        {isLocked && (
          <Menu.Item
            style={itemStyle}
            onPress={handleUnLockPhoto}
            title={
              <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                解鎖此圖片
              </CaptionFour>
            }
          />
        )}
        {!isLocked && (
          <Menu.Item
            style={itemStyle}
            onPress={handleLockPhoto}
            title={
              <CaptionFour style={{ color: theme.colors.white, textAlign: 'center' }}>
                鎖定此圖片
              </CaptionFour>
            }
          />
        )}
        <Menu.Item
          style={itemStyle}
          onPress={handleDeletePhoto}
          title={
            <CaptionFour style={{ color: theme.colors.pink, textAlign: 'center' }}>
              刪除此圖片
            </CaptionFour>
          }
        />
      </Menu>
    );
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
            source={{ uri: data?.fileInfoResponse?.url || `https://picsum.photos/id/23/200/300` }}
          />
        </TouchableOpacity>
        <View style={styles.bottomWrapper}>
          <TouchableOpacity>
            {mapIcon.heartOutlineIcon({ color: 'white', size: 20 })}
          </TouchableOpacity>
          <CaptionFour style={{ color: 'white', paddingLeft: 5 }}>{data.amount}</CaptionFour>
        </View>
        <View style={styles.bottomRightWrapper}>{renderMoreButton()}</View>

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

export default function ProfilePhoto(props) {
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const styles = useStyles();
  const { theme } = useTheme();
  const name = useSelector((state: RootState) => state.user.name);
  const { data: photoList } = useQuery(['fetchProfilePhotos', userId], () =>
    userApi.fetchUserPhotos({ token, id: userId }),
  );

  const navigation = useNavigation();
  const onPressPhoto = () => {
    navigation.navigate('ImageGalleryScreen', {
      images: photoList?.records.map(record => ({
        id: record.id,
        url: record.fileInfoResponse.url,
        point: record.amount,
        isLock: record.isLock,
        userId: record.userId,
        isLikeBefore:record.isLikeBefore,
      })),
    });
  };
  const renderItem = item => {
    return <ProfilePhotoItem onPressPhoto={onPressPhoto} data={item} />;
  };
  if (photoList?.records.length === 0) {
    return (
      <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <SubTitleOne style={{ textAlign: 'center', ...styles.interestButtonTitle }}>
          您尚未發布任何相簿
        </SubTitleOne>
        <ButtonTypeTwo
          onPress={() => {
            navigation.navigate('ImageBrowser', {
              backScreen: 'AddPhotoScreen',
              maxLength: 1,
            });
          }}
          buttonStyle={{
            paddingHorizontal: 50,
            marginTop: 10,
          }}
          style={{
            alignSelf: 'center',
          }}
          title="新增相片"
        />
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={{ paddingHorizontal: 8, paddingTop: 10 }}>
        <Row rowStyles={{ marginRight: -10 }}>
          {photoList?.records.map(item => (
            <Col colStyles={{ paddingRight: 10 }} key={item.id} xs={6} sm={6} md={6} lg={6}>
              {renderItem(item)}
            </Col>
          ))}
          <Col colStyles={{ paddingRight: 10 }} xs={6} sm={6} md={6} lg={6}>
            <TouchableOpacity
              key="addImage"
              onPress={() => {
                navigation.navigate('ImageBrowser', {
                  backScreen: 'AddPhotoScreen',
                  maxLength: 1,
                });
              }}
              style={[
                styles.image,
                {
                  backgroundColor: theme.colors.black2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                },
              ]}>
              {mapIcon.addIcon({ color: theme.colors.white, size: 80 })}
            </TouchableOpacity>
          </Col>
        </Row>
      </View>
    </ScrollView>
  );
}
