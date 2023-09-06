export * from '@rneui/themed';

declare module '@rneui/themed' {
  export interface TextProps {
    bold: boolean;
  }

  export interface Colors {
    black1: string;
    black2: string;
    black3: string;
    black4: string;
    black5: string;
    pink: string;
    pink1:string
    white: string;
    green: string;
    purple: string;
    yellow: string;
    grey2: string;
    grey3: string;
    grey4: string;
    grey5: string;
    grey6: string;
    linearGradient: string;
  }

  export interface FullTheme {
    colors: RecursivePartial<Colors>;
    Text: Partial<TextProps>;
  }
}
