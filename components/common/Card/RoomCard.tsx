import { View, Text, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Badge } from '@rneui/base';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { isNumber } from 'lodash';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from 'react-query';
import { isSameDay, parse } from 'date-fns';
import { mapIcon } from '../../../constants/IconsMapping';
import CommonModalComponent from '../CommonModalComponent';
import { CaptionFive, CaptionFour, SubTitleTwo } from '../Text';
import { convertTime } from '~/helpers/convertDate';
import { useAppDispatch } from '~/store';
import { updateCurrentChatId } from '~/store/roomSlice';
import { selectToken, selectUserId } from '~/store/userSlice';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { userApi } from '~/api/UserAPI';

const { width } = Dimensions.get('window');
const useStyles = makeStyles(theme => ({
  roomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 10,
    maxWidth: '100%',
  },
  roomLeftContainer: {},
  roomBodyContainer: {
    paddingLeft: 16,
    flexGrow: 1,
    maxWidth: width - 32 - 16 - 60 - 8,
  },
  roomRightContainer: {},
  roomAvatar: {
    width: 60,
    aspectRatio: 1,
    height: 60,
    borderRadius: 60,
  },
  roomName: {
    color: theme.colors?.white,
  },
  roomPreviewText: {
    color: theme.colors?.black3,
    paddingTop: 6,
  },
  roomCountBadge: {
    backgroundColor: theme.colors?.pink,
  },
  badgeContainer: {
    paddingTop: 6,
  },
  msgTime: {
    color: theme.colors?.white,
  },
}));

interface MessageRecord {
  chatId: string;
  content: string;
  createTime: string;
  id: number;
  isFromClient: boolean;
  notReadCount: number;
  senderId: number;
  senderAvatar: string;
  recipientAvatar: string;
  recipientId: number;
  senderName: string;
  recipientName: string;
  status: string;
  type: string;
}
interface IRoomCard {
  onDelete?: (id: string) => void;
  roomData: MessageRecord;
}

export default function RoomCard({ onDelete = () => { }, onRoomCardPress, roomData }: IRoomCard) {
  const { theme } = useTheme();
  const {
    content,
    type,
    senderName,
    notReadCount,
    senderAvatar,
    createTime,
    recipientId,
    senderId,
    recipientName,
    recipientAvatar,
  } = roomData;
  const styles = useStyles();

  const [collectionModal, setCollectionModal] = React.useState(false);
  const navigation = useNavigation();
  const [deleteWidth, setDeleteWidth] = React.useState(80);
  const [isLoading, setIsLoading] = React.useState(false);
  const swipeRef = useRef();
  const dispatch = useAppDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const queryClient = useQueryClient();
  const otherSideUserId = recipientId === userId ? senderId : recipientId;
  const otherSideAvatar = recipientId === userId ? senderAvatar : recipientAvatar;
  const otherSideUserName = recipientId === userId ? senderName : recipientName;

  const handleRoomCardPress = () => {
    dispatch(updateCurrentChatId(otherSideUserId));
    navigation.navigate('RoomChatScreen', {
      recipientId: otherSideUserId,
    });
  };
  const handleConfirm = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await userApi.deleteMessageRoom({ token, userId, recipientId: otherSideUserId });
      queryClient.invalidateQueries('getRoomList');
    } catch (error) {
      Alert.alert('Something went wrong');
    }
    setCollectionModal(false);
    swipeRef.current.animateRow(-width, -80);
    swipeRef.current.close();
    setDeleteWidth(80);
    setIsLoading(false);
  };
  const handleCancel = () => {
    setCollectionModal(false);
    swipeRef.current.animateRow(-width, -80);
    swipeRef.current.close();
    setDeleteWidth(80);
  };
  const handleOpen = () => {
    setCollectionModal(true);
  };
  const handlePressDelete = () => {
    setDeleteWidth(width);
    swipeRef.current.animateRow(swipeRef.current.currentOffset(), -width);
    handleOpen();
  };

  const rightAction = function (progress) {
    return (
      <TouchableOpacity
        onPress={handlePressDelete}
        style={{
          backgroundColor: theme.colors.pink,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          width: deleteWidth,
        }}>
        <View style={{ transform: [{ translateY: -12 }] }}>{mapIcon.deleteIcon()}</View>
      </TouchableOpacity>
    );
  };

  const isToday = isSameDay(parse(createTime, 'yyyy-MM-dd HH:mm:ss', new Date()), new Date());
  const isYesterDay = isSameDay(
    parse(createTime, 'yyyy-MM-dd HH:mm:ss', new Date()),
    new Date(new Date().getDate() - 1),
  );
  const renderTimeString = () => {
    return (
      <CaptionFive style={styles.msgTime}>
        {isToday && '今日'}
        {isYesterDay && '今日'}
        {convertTime(createTime)}
      </CaptionFive>
    );
  };

  return (
    <Swipeable
      useNativeAnimations
      friction={1}
      ref={swipeRef}
      overshootRight
      renderRightActions={rightAction}>
      <TouchableOpacity
        onPress={handleRoomCardPress}
        style={[styles.roomContainer, { backgroundColor: theme.colors.black1 }]}>
        <View style={styles.roomLeftContainer}>
          <Image
            style={styles.roomAvatar}
            source={otherSideAvatar ? { uri: otherSideAvatar } : defaultAvatar}
          />
        </View>
        <View style={styles.roomBodyContainer}>
          <SubTitleTwo style={styles.roomName}>{otherSideUserName || 'InMeet小幫手'}</SubTitleTwo>
          <CaptionFour numberOfLines={1} style={styles.roomPreviewText}>
            {type !== 'TEXT' ? '傳送一則檔案 ' : content}
          </CaptionFour>
        </View>
        <View style={styles.roomRightContainer}>
          {renderTimeString()}
          {notReadCount !== 0 && isNumber(notReadCount) && (
            <Badge
              value={notReadCount}
              containerStyle={styles.badgeContainer}
              badgeStyle={styles.roomCountBadge}
            />
          )}
        </View>
      </TouchableOpacity>
      <CommonModalComponent
        modalText="要刪除此對話嗎?刪除後無法再看到之前的聊天紀錄"
        isVisible={collectionModal}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
    </Swipeable>
  );
}
