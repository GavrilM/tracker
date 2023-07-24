import { createFont, createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import { createMedia } from '@tamagui/react-native-media-driver'

import { animations } from './animations'

const headingFont = createFont({
  family: 'Satoshi, Inter, Helvetica, Arial, sans-serif',
  size: {
    10: 40,
    9: 32,
    8: 28,
    7: 24
  },
  weight: {
    6: '400',
    7: '700',
    10: '700'
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: 0,
    9: -1,
    10: -2,
    12: -2,
    14: -3,
    15: -4,
  },
})

const bodyFont = createFont(
  {
    family: 'Satoshi, Inter, Helvetica, Arial, sans-serif',
    size: {
      true: 16,
      1: 10,
      2: 11,
      3: 12,
      4: 14,
      5: 16,
      6: 18,
      7: 20,
      8: 24,
      9: 30,
    }
  }
)

const numberFont = createInterFont()

export const config = createTamagui({
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
    number: numberFont
  },
  themes,
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})
