import colors from 'windicss/colors'

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

export default {
  CMW: {
    id: 1,
    customerType: 'B2C',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  B2B: {
    id: 5,
    customerType: 'B2B',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_UK: {
    id: 2,
    customerType: 'B2B',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_FR: {
    id: 3,
    customerType: 'B2B',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  CMW_DE: {
    id: 4,
    customerType: 'B2B',
    fonts: {
      sans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      secondary: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    colors: { ...defaultColors },
  },
  WILDVIGNERON: {
    id: 5,
    customerType: 'B2B',
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
