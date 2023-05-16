import colors from 'windicss/colors'

export type TCustomerType = 'B2C' | 'B2B'
export type TStores = 'CMW' | 'B2B' | 'CMW_UK' | 'CMW_FR' | 'CMW_DE' | 'WILDVIGNERON'
export type TSalesChannel = 'cmw_it_b2c' | 'cmw_it_b2b' | 'cmw_uk_b2c' | 'cmw_fr_b2c' | 'cmw_de_b2c'
export type TISO639 = 'it' | 'en' | 'fr' | 'de'

interface IStoreConfig {
  id: number
  salesChannel: TSalesChannel
  customerType: TCustomerType
  fonts: {
    sans: string[]
    secondary: string[]
  }
  colors: Record<string, any>
}

type TThemeConfig = {
  [k in TStores]?: IStoreConfig
}

const defaultColors = {
  primary: {
    DEFAULT: '#992545',
    50: '#fae4e8',
    100: '#F3BAC6',
    400: '#d94965',
    900: '#751f3e',
  },
  secondary: {
    DEFAULT: '#10312b',
    800: '#134c45',
    700: '#155B53',
    400: '#2C8982',
    100: '#ADD3D1',
  },
  body: colors.zinc[700],
  success: '#299100',
  error: '#E6362E',
  warning: '#FFB800',
  info: '#69baf1',
}

const themeConfig: TThemeConfig = {
  CMW: {
    id: 1,
    salesChannel: 'cmw_it_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  B2B: {
    id: 5,
    salesChannel: 'cmw_it_b2b',
    customerType: 'B2B',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_UK: {
    id: 2,
    salesChannel: 'cmw_uk_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_FR: {
    id: 3,
    salesChannel: 'cmw_fr_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_DE: {
    id: 4,
    salesChannel: 'cmw_de_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  WILDVIGNERON: {
    id: 5,
    salesChannel: 'cmw_it_b2c',
    customerType: 'B2C',
    fonts: {
      sans: ['"Readex Pro"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Readex Pro"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: {
      primary: {
        DEFAULT: '#0B4C3C',
        50: '#fae4e8',
        100: '#F3BAC6',
        400: '#d94965',
        900: '#751f3e',
      },
      secondary: {
        DEFAULT: '#10312b',
        800: '#154c44',
        700: '#175b53',
        400: '#2c8982',
        100: '#ADD3D1',
      },
      body: colors.zinc[700],
      success: '#299100',
      error: '#E6362E',
      warning: '#FFB800',
      info: '#69baf1',
    },
  },
}

export default themeConfig
