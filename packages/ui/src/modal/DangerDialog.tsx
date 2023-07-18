import { X } from '@tamagui/lucide-icons'
import {
  AlertDialog,
  Button,
  XStack,
  YStack,
} from 'tamagui'
import { FormButton } from '../form/FormButton'

type DangerDialogProps = {
  trigger: React.ReactElement,
  title: string,
  subtitle: string
  onConfirm?: () => void
}

export function DangerDialog({ trigger, title, subtitle, onConfirm }: DangerDialogProps) {
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        {trigger}
      </AlertDialog.Trigger>

      <AlertDialog.Portal zIndex={200_000}>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
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
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack space>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>
              {subtitle}
            </AlertDialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>No</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <FormButton type="danger" onPress={onConfirm}>Yes, delete</FormButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}
