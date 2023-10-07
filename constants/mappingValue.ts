export const EducationValue = {
  UNKNOWN: '不透露',
  ELEMENTARY: '小學',
  SECONDARY: '國中',
  HIGH_SCHOOL: '高中',
  UNIVERSITY: '大學',
  MASTER: '碩士',
  PHD: '博士',
};
export const EducationList = {
  ELEMENTARY: '小學',
  SECONDARY: '國中',
  HIGH_SCHOOL: '高中',
  UNIVERSITY: '大學',
  MASTER: '碩士',
  PHD: '博士',
  // 不透露: '不透露',
  // 高中職: '高中/職',
  // 五專: '五專',
  // 學士: '學士',
  // 碩士或以上: '碩士或以上',
};
export const heightList = {
  '150以下': '150以下',
    '151-155': '151-155',
    '156-160': '156-160',
    '161-165': '161-165',
    '166-170': '166-170',
    '171-175': '171-175',
    '176-180': '176-180',
    '181-185': '181-185',
    '186-190': '186-190',
    '191-195': '191-195',
    '196-200': '196-200',
    '200以上': '200以上',
};

export const ReligionValue = {
  UNKNOWN: '不透露',
  TAOISM: '道教',
  BUDDHISM: '佛教',
  CATHOLIC: '天主教',
  CHRISTIANITY: '基督教',
  ISLAM: '回教',
  HINDUISM: '印度教',
  MUSLIM: '穆斯林',
  JUDAISM: '猶太教',
  OTHER: '其他宗教',
  NONE: '沒有宗教',
};

export const HeightValue = {
  UNKNOWN: '不透露',
  '150以下': '150以下',
  '151-155': '151-155',
  '156-160': '156-160',
  '161-165': '161-165',
  '166-170': '166-170',
  '171-175': '171-175',
  '176-180': '176-180',
  '181-185': '181-185',
  '186-190': '186-190',
  '191-195': '191-195',
  '196-200': '196-200',
  '200以上': '200以上',
};
export const enum BLOOD_ENUM {
  A = 'A',
  B = 'B',
  O = 'O',
  AB = 'AB',
  UNKNOWN = '不透露',
}
export const enum CITYEnum {
  UNKNOWN = '不透露',
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

export const mapCity = {
  KLU: '基隆市',
  TPE: '台北市',
  TPH: '新北市',
  TYC: '桃園市',
  HSC: '新竹市',
  HSH: '新竹縣',
  MAL: '苗栗縣',
  TXG: '台中市',
  CWH: '彰化縣',
  NTO: '南投縣',
  YLH: '雲林縣',
  CYI: '嘉義市',
  CHI: '嘉義縣',
  TNN: '台南市',
  KHH: '高雄市',
  IUH: '屏東縣',
  TTT: '台東縣',
  HWC: '花蓮市',
  ILN: '宜蘭縣',
  PEH: '澎湖縣',
  KMN: '金門縣',
  LNN: '連江縣',
};

export const bloodList={
  A : 'A',
  O : 'O',
  AB : 'AB',
  B : 'B',
}
export const drinkingHabits={
  滴酒不沾 : '滴酒不沾',
  限社交酒 : '限社交酒',
  偶爾喝 : '偶爾喝',
  常喝 : '常喝',
}
export const smokingHabits={
  不抽 : '不抽',
  偶爾抽 : '偶爾抽',
  經常抽 : '經常抽',
}

export enum GENDEREnum {
  MALE = '男性',
  FEMALE = '女性',
}

export enum pointType {
  FIVE = 'FIVE',
  TEN = 'TEN',
  THIRTY = 'THIRTY',
  FIFTY = 'FIFTY',
  HUNDRED = 'HUNDRED',
}

export enum contactType {
  WECHAT = 'WECHAT',
  LINE = 'LINE',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  PHONE = 'PHONE',
}
export const numberToDay = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
};

export enum BLOCK_REPORT_TYPE {
  USER = 'USER',
  FILE = 'FILE',
  BLOG = 'BLOG',
}


export   const selectCityData = [
  {id:1, name:"基隆市", isSelect: false },
  {id:2, name:'台北市',  isSelect: false },
  {id:3, name:'新北市',  isSelect: false },
  {id:4, name: '桃園市', isSelect: false },
  {id:5, name:'新竹市',  isSelect: false },
  {id:6, name:'新竹縣',  isSelect: false },
  {id:7, name: '苗栗縣',  isSelect: false },
  {id:8, name: '台中市', isSelect: false },
  {id:9, name:'彰化縣',  isSelect: false },
  {id:10,name:'南投縣',  isSelect: false },
  {id:11,name:  '雲林縣', isSelect: false },
  {id:12,name: '嘉義市',  isSelect: false },
  {id:13,name: '嘉義縣', isSelect: false },
  {id:14,name:'台南市',  isSelect: false },
  {id:15,name: '高雄市', isSelect: false },
  {id:16,name:'屏東縣',  isSelect: false },
  {id:17,name: '台東縣', isSelect: false },
  {id:18,name:'花蓮市',  isSelect: false },
  {id:19,name:'宜蘭縣',  isSelect: false },
  {id:20,name:'澎湖縣',  isSelect: false },
  {id:21,name: '金門縣',  isSelect: false },
  {id:22,name:  '連江縣', isSelect: false },
];