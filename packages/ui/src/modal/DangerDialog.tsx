import { X } from '@tamagui/lucide-icons'
import {
  Adapt,
  Button,
  Dialog,
  Sheet,
  Unspaced,
  XStack,
  YStack,
} from 'tamagui'

type DangerDialogProps = {
  trigger: React.ReactElement,
  title: string,
  subtitle: string
  onConfirm?: () => void
}

export function DangerDialog({ trigger, title, subtitle, onConfirm }: DangerDialogProps) {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          space
        >
          <Dialog.Title color="$red9" mr={30}>{title}</Dialog.Title>
          <Dialog.Description color="$red11">
            {subtitle}
          </Dialog.Description>
          
          <YStack alignItems="flex-end" marginTop="$2">
            <XStack space>
            <Dialog.Close displayWhenAdapted asChild>
              <Button aria-label="Close">
                No
              </Button>
            </Dialog.Close>
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="red_Button" aria-label="Close" onPress={onConfirm}>
                Yes
              </Button>
            </Dialog.Close>
            </XStack>
          </YStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
