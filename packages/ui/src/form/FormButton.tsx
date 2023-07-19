import { Button, styled } from "tamagui";

export const FormButton = styled(Button, {
  color: 'white',
  variants: {
    type: {
      primary: {
        backgroundColor: '$blue10'
      },
      secondary: {
        backgroundColor: '$gray10'
      },
      save: {
        backgroundColor: '$green10'
      },
      danger: {
        backgroundColor: '$red10'
      },
      discourage: {
        borderColor: '$gray8',
      },
      disabled: {
        opacity: .5
      }
    }
  }
})