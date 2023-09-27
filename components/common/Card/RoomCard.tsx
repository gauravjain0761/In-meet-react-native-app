import { View, Text, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@rneui/themed';
import { Badge } from '@rneui/base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation } from '@react-navigation/native';
import { isNumber } from 'lodash';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from 'react-query';
import { isSameDay, parse } from 'date-fns';
import { mapIcon } from '../../../constants/IconsMapping';
import CommonModalComponent from '../CommonModalComponent';
import { BodyTwo, CaptionFive, CaptionFour, SubTitleTwo } from '../Text';
import { convertTime } from '~/helpers/convertDate';
import { useAppDispatch } from '~/store';
import { updateCurrentChatId } from '~/store/roomSlice';
import { selectToken, selectUserId } from '~/store/userSlice';
import defaultAvatar from '~/assets/images/icons/profile.png';
import { userApi } from '~/api/UserAPI';
import { fontSize } from '~/helpers/Fonts';
import ReportModal from '../ReportModal';
import VIPModal from '../VIPModal';

const { width } = Dimensions.get('window');
const useStyles = makeStyles((theme) => ({
  roomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingVertical: 10,
    // maxWidth: '100%',
  },
  roomLeftContainer: {
    borderWidth:1,
    borderRadius: 48,
    borderColor:theme.colors.black2
  },
  roomBodyContainer: {
    paddingLeft: 16,
    flexGrow: 1,
    // maxWidth: width - 32 - 16 - 60 - 8,
  },
  roomRightContainer: {},
  roomAvatar: {
    width: 48,
    aspectRatio: 1,
    height: 48,
    borderRadius: 48,
  },
  roomName: {
    color: theme.colors?.white,
  },
  roomPreviewText: {
    color: theme.colors?.white,
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
  unChosenBtnStyle: {
    marginTop: 15,
    width: 185,
    alignSelf:'center'
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

export default function RoomCard({ onDelete = () => {}, onRoomCardPress, roomData }: IRoomCard) {
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
  const [deleteWidth, setDeleteWidth] = React.useState(70);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openVIP, setOpenVIP] = React.useState(false);
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
     //@ts-ignore
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
     //@ts-ignore
    swipeRef.current.animateRow(-width, -80);
     //@ts-ignore
    swipeRef.current.close();
    setDeleteWidth(80);
    setIsLoading(false);
  };
  const handleCancel = () => {
    setCollectionModal(false);
     //@ts-ignore
    swipeRef.current.animateRow(-width, -80);
     //@ts-ignore
    swipeRef.current.close();
    setDeleteWidth(80);
  };
  const handleOpen = () => {
    setCollectionModal(true);
  };
  const handleOpenInfo = () => {
    setOpenVIP(true);
  };
  const handlePressDelete = () => {
    setDeleteWidth(width);
    //@ts-ignore
    swipeRef.current.animateRow(swipeRef.current.currentOffset(), -width);
    handleOpen();
  };
  
  const handlePressInfo = () => {
    handleOpenInfo();
  };

  const rightAction = function () {
    return (
      <View style={{flexDirection:'row'}}>
      <TouchableOpacity
        onPress={handlePressInfo}
        style={{
          backgroundColor: theme.colors.black2,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          width: deleteWidth,
        }}>
        <View style={{ transform: [{ translateY: -12 }] }}>{mapIcon.inEyeIcon({size:20})}</View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePressDelete}
        style={{
          backgroundColor: "#FF375F",
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          width: deleteWidth,
        }}>
        <View style={{ transform: [{ translateY: -12 }] }}>{mapIcon.deleteIcon({size:30})}</View>
      </TouchableOpacity>
      </View>
    );
  };

  const isToday = isSameDay(parse(createTime, 'yyyy-MM-dd HH:mm:ss', new Date()), new Date());
  const isYesterDay = isSameDay(
    parse(createTime, 'yyyy-MM-dd HH:mm:ss', new Date()),
    new Date(new Date().getDate() - 1)
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
    <GestureHandlerRootView>

    
    <Swipeable
      // useNativeAnimations
      // friction={1}
       //@ts-ignore
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BodyTwo style={[styles.roomName, { flex: 1 }]}>
              {otherSideUserName || 'InMeet小幫手'}
            </BodyTwo>
            {renderTimeString()}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CaptionFour numberOfLines={1} style={[styles.roomPreviewText, { flex: 1 }]}>
              {type !== 'TEXT' ? '傳送一則檔案 ' : content}
            </CaptionFour>
            {notReadCount !== 0 && isNumber(notReadCount) && (
              <Badge
                value={notReadCount}
                containerStyle={styles.badgeContainer}
                badgeStyle={styles.roomCountBadge}
                textStyle={{ fontSize: fontSize(12), fontFamily: 'roboto' }}
              />
            )}
          </View>
        </View>
        {/* <View style={styles.roomRightContainer}>
          {notReadCount !== 0 && isNumber(notReadCount) && (
            <Badge
              value={notReadCount}
              containerStyle={styles.badgeContainer}
              badgeStyle={styles.roomCountBadge}
            />
          )}
        </View> */}
      </TouchableOpacity>
      <View
        style={{
          // paddingTop: 10,
          // marginTop: 3,
          marginLeft: 90,
          // marginBottom: 10,
          height:1,
          width:'72%',
          borderWidth:0.5,
          borderColor: theme.colors.black2,
        }}
      />
      {/* <CommonModalComponent
        modalText="要刪除此對話嗎?刪除後無法再看到之前的聊天紀錄"
        isVisible={collectionModal}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      /> */}
      <ReportModal
        modalText={'刪除後無法再看到之前的聊天紀錄'}
        buttonOneTitle = '刪除'
        buttonTwoTitle = '取消'
        headerShow={true}
        isVisible={collectionModal}
        onConfirm={handleConfirm}
        showCancel={true}
        headerShowText={'要刪除此對話嗎？'}
        unChosenBtnStyle={styles.unChosenBtnStyle}
        chosenBtnStyle={styles.unChosenBtnStyle}
        onClose={handleCancel}
      />
      <VIPModal
          isVisible={openVIP}
          textShow={true}
          titleText="升級VIP即可【封鎖用戶】"
          onClose={() => setOpenVIP(false)}
          onConfirmCallback={()=>{
            setTimeout(() => {
              setOpenVIP(false)
            }, 1000);
           
          }}
        />
    </Swipeable>
    </GestureHandlerRootView>
  );
}
