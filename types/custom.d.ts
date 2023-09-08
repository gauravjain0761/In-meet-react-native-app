type ActionResponse<T extends object> = {
  code: 200 | 400 | 500 | 20000;
  message: string;
  success: boolean;
} & T;

type Hobby = {
  id: number;
  createTime: string;
  modifyTime: string;
  userCount: number;
  hobbyName: string;
  isDisable: boolean;
  imageURL: string;
};

type User = {
  id?: number;
  createTime?: string;
  modifyTime?: string;
  avatar?: string;
  publicPhoto?: string;
  privatePhoto?: string;
  account?: string;
  name: string;
  birthday?: string;
  gender?: GENDER;
  level?: LEVEL;
  city: CITY | '';
  hobby?: string;
  point: number;
  bloodType?: 'A' | 'B' | 'AB' | 'O' | 'UNKNOWN';
  job?: string;
  religion?: RELIGION;
  education?: EDUCATION;
  about?: string;
  facebook?: string;
  google?: string;
  line?: string;
  apple?: string;
  email: string;
  phone?: string;
  roleName?: string;
  roleCode?: string;
  constellation?: string;
  starAmount: number;
  height: null | number;
  hobbies: Hobby[];
  signature?: string;
  deviceToken: string;
  isSystemEnable: boolean;
  isMessageEnable: boolean;
  isBlogEnable: boolean;
  isLikeEnable: boolean;
  isGetLoginReward:boolean,
  contactFacebook: string;
  contactIg: string;
  contactLine: string;
  contactWechat: string;
  vipEndTime: string;
  modifyTime: string;
  isChatUnLockBefore: boolean;
  lastLoginTime: string;
};

declare type RELIGION = 'NONE';

declare type EDUCATION =
  | 'ELEMENTARY'
  | 'SECONDARY'
  | 'HIGH_SCHOOL'
  | 'UNIVERSITY'
  | 'MASTER'
  | 'PHD';

declare enum CITY {
  KLU = '基隆市',
  TPE = '台北市',
  TPH = '新北市',
  TYC = '桃園市',
  HSC = '新竹市',
  HSH = '新竹縣',
  MAL = '苗栗縣',
  TXG = '台中市',
  CWH = '彰化縣',
  NTO = '南投縣',
  YLH = '雲林縣',
  CYI = '嘉義市',
  CHI = '嘉義縣',
  TNN = '台南市',
  KHH = '高雄市',
  IUH = '屏東縣',
  TTT = '台東縣',
  HWC = '花蓮市',
  ILN = '宜蘭縣',
  PEH = '澎湖縣',
  KMN = '金門縣',
  LNN = '連江縣',
}

declare enum LEVEL {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

declare enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

declare enum HOBBIES {
  EXERCISE = 'EXERCISE',
  FITNESS = 'FITNESS',
  FOOD = 'FOOD',
  PET = 'PET',
  MUSIC = 'MUSIC',
  ART = 'ART',
  DRINK = 'DRINK',
  GAME = 'GAME',
  PHOTO = 'PHOTO',
  TRAVEL = 'TRAVEL',
  SING = 'SING',
  INVEST = 'INVEST',
  MOVIE = 'MOVIE',
  COFFEE = 'COFFEE',
}

export type ListItem = {
  label: string;
  value: number;
  itemColor?: string;
};

export interface PickerProps {
  items?: Array<ListItem>;
  onScroll?: ({ index }: { index: number }) => void;
  onMomentumScrollBegin?: ({ index }: { index: number }) => void;
  onMomentumScrollEnd?: ({ index }: { index: number }) => void;
  onScrollBeginDrag?: ({ index }: { index: number }) => void;
  onScrollEndDrag?: ({ index }: { index: number }) => void;
  initialSelectedIndex?: number;
  height?: number;
  width?: number;
  allItemsColor?: string;
  selectedItemBorderColor?: string;
  fontSize?: number;
  fontFamily?: string;
  topGradientColors?: Array<string>;
  bottomGradientColors?: Array<string>;
  transparentItemRows?: number;
}

export interface PickerListItemProps {
  label: string;
  fontSize: number;
  height: number;
  fontFamily: string;
  itemIndex:number,
  index:number,
}
