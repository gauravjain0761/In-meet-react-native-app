import { Image } from 'react-native';
import facebookContactIcon from '../assets/images/contactIcons/Facebook.png';
import instagramContactIcon from '../assets/images/contactIcons/Instagram.png';
import lineContactIcon from '../assets/images/contactIcons/line.png';
import mailContactIcon from '../assets/images/contactIcons/mail.png';
import phoneContactIcon from '../assets/images/contactIcons/phone.png';
import weChatContactIcon from '../assets/images/contactIcons/wechat.png';
import google from '../assets/images/icons/Google.png';
import appleContactIcon from '../assets/images/icons/Apple.png';

type IIcon = {
  color?: string;
  size?: number;
};
export const mapContactIcon = {
  facebookContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={facebookContactIcon} />
  ),
  instagramContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={instagramContactIcon} />
  ),
  lineContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={lineContactIcon} />
  ),
  mailContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={mailContactIcon} />
  ),
  phoneContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={phoneContactIcon} />
  ),
  weChatContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={weChatContactIcon} />
  ),
  googleContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={google} />
  ),
  appleContactIcon: ({ color, size = 20 }: IIcon = {}) => (
    <Image style={{ tintColor: color, width: size, height: size }} source={appleContactIcon} />
  ),
};
