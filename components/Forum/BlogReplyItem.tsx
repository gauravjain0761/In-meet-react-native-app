import { View, Text, TouchableOpacity, Image, useWindowDimensions, TextInput } from 'react-native';
import React from 'react';
import { makeStyles } from '@rneui/themed';

import { CaptionFive, SubTitleTwo } from '../../components/common/Text';
import { BlogReply } from '~/store/forumSlice';
import { convertTime } from '~/helpers/convertDate';
import defaultAvatar from '~/assets/images/icons/profile.png';

const useStyles = makeStyles(theme => ({
  headerStyle: {
    backgroundColor: theme.colors?.black1,
  },
  headerTitle: {
    color: theme.colors?.white,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  postDetailContainer: {
    paddingLeft: 6,
    justifyContent: 'center',
  },
  imageContainer: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  avatar: {
    resizeMode: 'cover',
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  avatarDisplayName: {
    color: theme.colors?.white,
  },
  postTime: {
    color: theme.colors?.black4,
  },
  carouselImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 20,
    paddingTop: 12,
  },
  likeCount: {
    color: theme.colors?.white,
    paddingLeft: 6,
    paddingRight: 10,
  },
  chatCount: {
    color: theme.colors?.white,
    paddingLeft: 6,
  },
  sendMessage: {
    color: theme.colors?.white,
  },
  messageContianer: {
    paddingLeft: 6,
    justifyContent: 'center',
  },
  messageWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingRight: 20,
    paddingBottom: 20,
  },
  grayText: {
    color: theme.colors?.black4,
  },
}));

interface BlogReplyItemProps {
  blogReply: BlogReply;
}

export default function BlogReplyItem(props: BlogReplyItemProps) {
  const { blogReply } = props;
  const styles = useStyles();

  return (
    <View style={styles.messageWrapper}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={[styles.imageContainer, { alignSelf: 'center' }]}>
          <Image
            style={styles.avatar}
            source={blogReply.user.avatar ? { uri: blogReply.user.avatar } : defaultAvatar}
          />
        </TouchableOpacity>
        <View style={styles.messageContianer}>
          <SubTitleTwo style={styles.sendMessage}>{blogReply.user.name}</SubTitleTwo>
          <CaptionFive style={[styles.sendMessage, { maxWidth: '80%' }]}>
            {blogReply.content}
          </CaptionFive>
        </View>
      </View>
      <CaptionFive style={styles.grayText}>{convertTime(blogReply.modifyTime)}</CaptionFive>
    </View>
  );
}
