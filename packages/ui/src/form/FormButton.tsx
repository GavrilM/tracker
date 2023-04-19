import { Button, styled } from "tamagui";

export const FormButton = styled(Button, {
  color: 'white',
  variants: {
    type: {
      primary: {
        backgroundColor: '$blue10Light'
      },
      secondary: {
        backgroundColor: '$gray10Light'
      },
      save: {
        backgroundColor: '$green10Light'
      },
      danger: {
        backgroundColor: '$red1Dark'
      },
      discourage: {
        backgroundColor: 'white',
        borderColor: '$gray1Dark',
        color: '$gray1Dark'
      }
    }
  }
})