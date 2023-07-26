import { Card, Form, H2, XStack, YStack, SizableText, Paragraph, Spinner, FormButton, TextInput } from "@my/ui";
import * as Realm from "realm-web"
import { useRealmApp } from "app/provider/realm";
import { useEffect, useState } from "react";
import { useRouter } from "solito/router";
import { createParam } from 'solito'
import { routes } from "app/navigation/web";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { handleAuthenticationError } from "./utils";

type LoginParams = {
  type: string,
  token: string,
  tokenId: string,
}
const { useParam } = createParam<LoginParams>()

export function LoginScreen() {
  const realmApp = useRealmApp();
  const router = useRouter()
  const [type] = useParam('type')
  const [token] = useParam('token')
  const [tokenId] = useParam('tokenId')
  
  const [isSignup, setIsSignup] = useState(false);
  const toggleIsSignup = () => {
    clearErrors();
    setIsSignup(!isSignup);
  };

  // Authentication errors
  const noErrors = {
    email: '',
    password: '',
    other: '',
  };
  const [error, setError] = useState(noErrors);
  const clearErrors = () => setError(noErrors);
  // const NonAuthErrorAlert = useErrorAlert({
  //   error: error.other,
  //   clearError: () => {
  //     setError((prevError) => ({ ...prevError, other: null }));
  //   },
  // });
  
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgot, setForgot] = useState(0)
  const [isSubmitting, setSubmitting] = useState(false)
  const [isReset, setReset] = useState(0)

  const onFormSubmit = async () => {
    clearErrors();
    setSubmitting(true)
    try {
      if (forgot) {
        await realmApp.emailPasswordAuth.sendResetPasswordEmail({ email });
      }
      else if (isReset && token && tokenId) {
        await realmApp.emailPasswordAuth.resetPassword({ token, tokenId, password })
      }
      else {
        if (isSignup) {
          await realmApp.emailPasswordAuth.registerUser({ email: email.toLowerCase(), password });
        }
        await realmApp.logIn(Realm.Credentials.emailPassword(email.toLowerCase(), password));
      }
    } catch (err) {
      handleAuthenticationError(err, setError);
      if (isReset)
        setError({...error, password: 'Link expired, please try again'})
    } finally {
      if (forgot) 
        setForgot(2)
      if (isReset)
        setReset(2)
      setSubmitting(false)
    }
  };

  useEffect(() => {
    if(realmApp.currentUser)
      router.replace(routes.home)

    if(!realmApp.currentUser && type === 'trial') {
      realmApp.logIn(Realm.Credentials.anonymous());
    }

    if(type === 'reset' && token && tokenId)
      setReset(1)
  }, [type, realmApp.currentUser])
  if(realmApp.currentUser || type === 'trial') {
    return <YStack f={1} ai="center" jc="center"><Spinner /></YStack>
  }

  let title = "Log In"
  let subtitle = "Enter your email and a password to log in with an existing account."
  let buttonText = "Log In"
  if(isSignup) {
    title = "Sign Up"
    subtitle = "Enter your email and a password to create a new account."
    buttonText = "Create Account"
  } else if (forgot === 1) {
    title = "Forgot Password"
    subtitle = "Enter your email to receive a link to reset your password."
    buttonText = "Send reset email"
  } else if (forgot === 2) {
    title = "Forgot Password"
    subtitle = "Email sent! Please click the link in the email to reset your password."
  } else if (isReset === 1) {
    title = "Reset Password"
    subtitle = "Enter your new password."
    buttonText = "Reset password"
  } else if (isReset === 2) {
    title = "Reset Password"
    subtitle = "Your password has been reset. You may now log in."
  }

  return (
    <YStack f={1} ai="center" jc="center">
      <Card width={400} p={36}>
        <Form onSubmit={onFormSubmit}>
          <H2>{title}</H2>
          <Paragraph mt={10} mb={30} lineHeight={16}>{subtitle}</Paragraph>
          {/* <NonAuthErrorAlert /> */}
          {forgot < 2 && !isReset && <YStack>
              <TextInput onChange={setEmail} placeholder="Email" errorMessage={error.email || undefined}/>
            </YStack>
          }
          {!forgot && isReset < 2 &&  
            <YStack>
              <XStack mt={20}>
                <TextInput onChange={setPassword} placeholder="Password" 
                  inputProps={{secureTextEntry: !showPassword}}
                  errorMessage={error.password || undefined}/>
                <XStack px={10} ai='center' onPress={toggleShowPassword} opacity={.7} cursor="pointer">
                  {showPassword ? <EyeOff/> : <Eye/>}</XStack>
              </XStack>
              {!isSignup && !isReset && <SizableText onPress={() => setForgot(1)} cursor="pointer"
                style={{textDecorationLine: "underline"}} opacity={.6} mt={10}>Forgot password?</SizableText>
              }
            </YStack>
          }
          {forgot < 2 && isReset < 2 && <Form.Trigger disabled={isSubmitting}>
            <FormButton type="primary" size="$4" mt={20} mb={20}>
                {isSubmitting 
                  ? <Spinner/>
                  : <SizableText textAlign="center">{buttonText}</SizableText>
                }
              </FormButton>
            </Form.Trigger>
          }
          {!forgot && !isReset
            ? <SizableText onPress={toggleIsSignup} cursor="pointer" style={{textDecorationLine: "underline"}}>
              {isSignup
                ? "Already have an account? Log In"
                : "Sign up for an account"}
            </SizableText>
            : <SizableText onPress={() => {setForgot(0); setReset(0)}} cursor="pointer" 
              style={{textDecorationLine: "underline"}}>Back</SizableText>
          }
        </Form>
      </Card>
      <SizableText position="absolute" top={20} left={40} fow='700' fos='$8'>Lifelog</SizableText>
    </YStack>
  );
}
