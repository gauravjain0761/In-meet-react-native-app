import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Badge } from '@rneui/base';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { isNumber } from 'lodash';
import { isSameDay, parse, toDate } from 'date-fns';
import { CaptionFive, CaptionFour, SubTitleTwo } from '../Text';
import { convertTime } from '~/helpers/convertDate';
import logo from '~/assets/images/logo/logo.png';

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
    height: 60,
    borderRadius: 60,
    backgroundColor: theme.colors?.black2,
    justifyContent: 'center',
    alignItems: 'center',
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
interface IHelperRoomCard {
  roomData: MessageRecord;
}

export default function HelperRoomCard({ roomData }: IHelperRoomCard) {
  const { theme } = useTheme();
  const { content, type, notReadCount, createTime } = roomData;
  const styles = useStyles();

  const navigation = useNavigation();

  const handleRoomCardPress = () => {
    navigation.push('HelperRoomChatScreen');
  };
  const isToday = isSameDay(parse(createTime, 'yyyy-MM-dd HH:mm:ss', new Date()), new Date());
  const isYesterDay = isSameDay(
    parse(createTime, 'yyyy-MM-dd HH:mm:ss', new Date()),
    new Date(new Date().getDate() - 1),
  );
  const renderTimeString = () => {
    return <CaptionFive style={styles.msgTime}>{convertTime(createTime)}</CaptionFive>;
  };
  return (
    <Swipeable useNativeAnimations friction={1} overshootRight>
      <TouchableOpacity
        onPress={handleRoomCardPress}
        style={[styles.roomContainer, { backgroundColor: theme.colors.black1 }]}>
        <View style={styles.roomLeftContainer}>
          <View style={styles.roomAvatar}>
            <Image style={{ width: '50%', height: '50%' }} source={logo} />
          </View>
        </View>
        <View style={styles.roomBodyContainer}>
          <SubTitleTwo style={styles.roomName}>InMeet小幫手</SubTitleTwo>
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
    </Swipeable>
  );
}
