import { Image } from 'react-native';
import invisiblePassword from '../assets/images/invisiblePassword.png';
import DefaultAvatar from '../assets/svg_icon/icon/default_avatar.svg';
import location from '../assets/images/icons/location.png';
import more from '../assets/images/icons/more.png';
import datingSearch from '../assets/images/icons/datingSearch.png';
import interestSearch from '../assets/images/icons/interestSearch.png';
import forums from '../assets/images/icons/forums.png';
import ChatIcon from '../assets/svg_icon/icon/chaticon.svg';
import profileIcon from '../assets/images/icons/profile.png';
import filterIcon from '../assets/images/icons/filter.png';
import StarIcon from '../assets/svg_icon/icon/staricon.svg';
import LikeIcon from '../assets/svg_icon/icon/likeicon.svg';
import confirmIcon from '../assets/images/icons/confirmIcon.png';
import locationIcon from '../assets/images/icons/locationIcon.png';
import shareIcon from '../assets/images/icons/share.png';
import searchIcon from '../assets/images/icons/searchIcon.png';
import sendIcon from '../assets/images/icons/sendIcon.png';
import deleteIcon from '../assets/images/icons/deleteIcon.png';
import photoIcon from '../assets/images/icons/photoIcon.png';
import ContactIcon from '../assets/svg_icon/icon/contacticon.svg';
import inquiryIcon from '../assets/images/icons/inquiryIcon.png';
import settingIcon from '../assets/images/icons/settingIcon.png';
import personalIcon from '../assets/images/icons/personalIcon.png';
import diamondIcon from '../assets/images/icons/vip.png';
import copyIcon from '../assets/images/icons/copyIcon.png';
import nextStepIcon from '../assets/images/icons/nextStepIcon.png';
import blockIcon from '../assets/images/icons/block.png';
import editIcon from '../assets/images/icons/editIcon.png';
import addIcon from '../assets/images/icons/addIcon.png';
import heartOutlineIcon from '../assets/images/icons/heart.png';
import lockIcon from '../assets/images/icons/lock.png';
import footprintIcon from '../assets/images/icons/footprint.png';
import likeIcon from '../assets/images/icons/like.png';
import envelopeIcon from '../assets/images/icons/envelope.png';
import mobileIcon from '../assets/images/icons/mobile.png';
import backIcon from '../assets/images/icons/icon-back.png';
import illus3zIcon from '../assets/images/firstLogin/illus3.png';
import closeIcon from '../assets/images/icons/close.png';

type IIcon = {
  color?: string;
  size?: number;
};
export const mapIcon = {
  invisiblePassword: ({ color }: IIcon = {}) => (
    <Image style={{ tintColor: color }} source={invisiblePassword} />
  ),
  defaultAvatar: ({ color, size }: IIcon = {}) => (
    <DefaultAvatar fill={color} width={size} height={size} />
  ),
  locationLogo: ({ color }: IIcon = {}) => <Image style={{ tintColor: color }} source={location} />,
  more: ({ color }: IIcon = {}) => <Image style={{ tintColor: color }} source={more} />,
  datingSearch: ({ color }: IIcon = {}) => (
    <Image style={{ tintColor: color }} source={datingSearch} />
  ),
  interestSearch: ({ color }: IIcon = {}) => (
    <Image style={{ tintColor: color }} source={interestSearch} />
  ),
  forums: ({ color }: IIcon = {}) => <Image style={{ tintColor: color }} source={forums} />,
  chatIcon: ({ color, size = 24 }: IIcon = {}) => (
    <ChatIcon fill={color} width={size} height={size} />
  ),
  profileIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={profileIcon} />
  ),
  filterIcon: ({ color }: IIcon = {}) => <Image style={{ tintColor: color }} source={filterIcon} />,
  starIcon: ({ color, size }: IIcon = {}) => <StarIcon fill={color} width={size} height={size} />,
  likeIcon: ({ color, size }: IIcon = {}) => <LikeIcon fill={color} width={size} height={size} />,
  confirmIcon: ({ color, size }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={confirmIcon} />
  ),
  locationIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={locationIcon} />
  ),
  shareIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={shareIcon} />
  ),
  searchIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={searchIcon} />
  ),
  sendIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={sendIcon} />
  ),
  deleteIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={deleteIcon} />
  ),
  photoIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={photoIcon} />
  ),
  contactIcon: ({ color = '#A8ABBD', size = 24 }: IIcon = {}) => (
    <ContactIcon fill={color} width={size} height={size} />
  ),
  inquiryIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={inquiryIcon} />
  ),
  settingIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={settingIcon} />
  ),
  personalIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={personalIcon} />
  ),
  diamondIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={diamondIcon} />
  ),
  copyIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={copyIcon} />
  ),
  nextStepIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={nextStepIcon} />
  ),
  blockIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={blockIcon} />
  ),
  editIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={editIcon} />
  ),
  addIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={addIcon} />
  ),
  heartOutlineIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={heartOutlineIcon} />
  ),
  lockIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={lockIcon} />
  ),
  footprintIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={footprintIcon} />
  ),
  mobileIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }}  source={mobileIcon} />
  ),
  envelopeIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }}  source={envelopeIcon} />
  ),
  backIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }}  source={backIcon} />
  ),
  closeIcon: ({ color, size = 24 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }}  source={closeIcon} />
  ),
  illus3zIcon:illus3zIcon
};
// to change png to svg, change the width, height and fill of the original svg file to ""(empty string),
// and update the svg source path "import ContactIcon from '../assets/svg_icon/icon/contacticon.svg';"
// then change the form to this :
// "contactIcon: ({ color="#A8ABBD", size = 24 }: IIcon = {}) => ( <ContactIcon fill={color} width={size} height={size}/>),"
// for every svg file, remember to captilize the first letter of the type name !
