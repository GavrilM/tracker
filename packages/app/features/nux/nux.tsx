// list of masks + title + text + positions
// overlay + window

import { Button, Dialog, FormButton, Unspaced, XStack } from "@my/ui"
import { useState } from "react"
import { NuxSteps } from "./nuxSteps"
import { X } from "@tamagui/lucide-icons"

export function NewUserExperience({ open, onComplete }) {
  const [stepNum, setStepNum] = useState(0)
  const { title, description, Mask, x, y } = NuxSteps[stepNum]

  return (
    <Dialog open={open}>

      {open && <Mask/>}
      <Dialog.Portal>
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
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
          maw={500}
          position="relative"
        >
          <Dialog.Title mt={20}>{title}</Dialog.Title>
          <Dialog.Description>
            {description}
          </Dialog.Description>

          <XStack alignSelf="flex-end" space>
            {stepNum > 0 &&
              <FormButton type="secondary" aria-label="Back" onPress={() => setStepNum(stepNum-1)}>
                Back</FormButton>
            }
            {stepNum === NuxSteps.length - 1 
              ? <FormButton type="primary" aria-label="Close" onPress={onComplete}>
                  Finish
                </FormButton>
              : <FormButton type="primary" aria-label="Next" onPress={() => setStepNum(stepNum+1)}>
                Next</FormButton>
            }
          </XStack>

          <Unspaced>
            <Button
              position="absolute"
              top="$3"
              right="$3"
              size="$2"
              circular
              icon={X}
              onPress={onComplete}
            />
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog>
  )
}