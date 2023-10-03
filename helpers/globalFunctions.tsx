import { Dimensions, Platform } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";



export const screen_width: number = Dimensions.get("window").width;
export const screen_height: number = Dimensions.get("window").height;

export const wp = (val: number) => {
  return widthPercentageToDP((val * 100) / 375);
};

export const hp = (val: number) => {
  return heightPercentageToDP((val * 100) / 812);
};

export const isIos = Platform.OS === "ios";


