import { Form, FormButton, H2, Paragraph, Sheet, SizableText, TextInput, XStack, YStack } from "@my/ui";
import * as Realm from "realm-web"
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { handleAuthenticationError } from "app/features/login/utils";
import { useRealmApp } from "app/provider/realm";
import { useState } from "react";


export function SignUpSheet({isOpen, onClose}) {
  const realmApp = useRealmApp();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const noErrors = {
    email: null,
    password: null,
    other: null,
  };
  const [error, setError] = useState(noErrors);
  const clearErrors = () => setError(noErrors);

  const onFormSubmit = async () => {
    clearErrors();
    try {
      await realmApp.emailPasswordAuth.registerUser({ email, password });
      const credentials = Realm.Credentials.emailPassword(email, password);
      await realmApp.currentUser?.linkCredentials(credentials);
    } catch (err) {
      handleAuthenticationError(err, setError);
    }
  };

  let content = (
    <YStack f={1} ai='center' jc='center'>
      <H2>Nice, you're signed up!</H2>
      <FormButton type="primary" size="$4" mt={20} mb={20} onPress={onClose}>
        <SizableText textAlign="center">Close</SizableText>
      </FormButton>
    </YStack>
  )
  if(!realmApp.currentUser?.profile.email) {
    content = (
      <YStack f={1} ai='center' jc='center'>
        <Form onSubmit={onFormSubmit} ai='center'>
          <H2>Create an account</H2>
          <Paragraph mt={10} mb={60} lineHeight={16}>
            Enter your email and a password to create a new account.
          </Paragraph>
          <TextInput onChange={setEmail} placeholder="Email" errorMessage={error.email || undefined}/>
          <XStack mt={20} width='100%'>
            <TextInput onChange={setPassword} placeholder="Password" 
              inputProps={{secureTextEntry: !showPassword}}
              errorMessage={error.password || undefined}/>
            <XStack px={10} ai='center' onPress={toggleShowPassword} opacity={.7} cursor="pointer">
              {showPassword ? <EyeOff/> : <Eye/>}</XStack>
          </XStack>
          <Form.Trigger asChild>
            <FormButton type="primary" size="$4" mt={20} mb={20}>
              <SizableText textAlign="center">Create Account</SizableText>
            </FormButton>
          </Form.Trigger>
        </Form>
      </YStack>
    )
  }

  return (
    <Sheet modal open={isOpen} snapPoints={[90]}
      onOpenChange={o => o ? null : onClose()}
      dismissOnSnapToBottom
      zIndex={100_000}
      animationConfig={{
        type: 'spring',
        damping: 40,
        stiffness: 450,
      }}>
      <Sheet.Handle bc='white'/>
      <Sheet.Overlay />
      <Sheet.Frame>
        {isOpen && content}
      </Sheet.Frame>
    </Sheet>
  )
}