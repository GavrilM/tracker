import { Card, Form, Input, H2, XStack, YStack, Label, Button, SizableText, Paragraph, Spinner, FormButton, TextInput } from "@my/ui";
import * as Realm from "realm-web"
import { useRealmApp } from "app/provider/realm";
import { useEffect, useState } from "react";
import { useRouter } from "solito/router";
import { createParam } from 'solito'
import { routes } from "app/navigation/web";
import { Eye, EyeOff } from "@tamagui/lucide-icons";

type LoginParams = {type: string}
const { useParam } = createParam<LoginParams>()

export function LoginScreen() {
  const realmApp = useRealmApp();
  const router = useRouter()
  const [type, setType] = useParam('type')
  
  const [isSignup, setIsSignup] = useState(false);
  const toggleIsSignup = () => {
    clearErrors();
    setIsSignup(!isSignup);
  };

  // Authentication errors
  const noErrors = {
    email: null,
    password: null,
    other: null,
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

  const onFormSubmit = async () => {
    clearErrors();
    try {
      if (isSignup) {
        await realmApp.emailPasswordAuth.registerUser({ email, password });
      }
      await realmApp.logIn(Realm.Credentials.emailPassword(email, password));
    } catch (err) {
      handleAuthenticationError(err, setError);
    }
  };

  useEffect(() => {
    if(realmApp.currentUser)
      router.replace(routes.home)

    if(type === 'trial') {
      realmApp.logIn(Realm.Credentials.anonymous());
    }
  })
  if(realmApp.currentUser || type === 'trial') {
    return <Spinner />
  }

  return (
    <YStack f={1} ai="center" jc="center">
      <Card width={400} p={36}>
        <Form onSubmit={onFormSubmit}>
          <H2>Lifelog (beta)</H2>
          <Paragraph mt={10} mb={30} lineHeight={16}>
            {isSignup
              ? "Enter your email and a password to create a new account."
              : "Enter your email and a password to log in with an existing account."}
          </Paragraph>
          {/* <NonAuthErrorAlert /> */}
          <YStack>
            <TextInput onChange={setEmail} placeholder="Email" errorMessage={error.email || undefined}/>
          </YStack>
          
          <XStack mt={20}>
            <TextInput onChange={setPassword} placeholder="Password" 
              inputProps={{secureTextEntry: !showPassword}}
              errorMessage={error.password || undefined}/>
            <XStack px={10} ai='center' onPress={toggleShowPassword} opacity={.7} cursor="pointer">{showPassword ? <EyeOff/> : <Eye/>}</XStack>
          </XStack>
          <Form.Trigger asChild>
            <FormButton type="primary" size="$4" mt={20} mb={20}>
              <SizableText textAlign="center">{isSignup ? "Create Account" : "Log In"}</SizableText>
            </FormButton>
          </Form.Trigger>
          <XStack onPress={toggleIsSignup} cursor="pointer">
            <SizableText style={{textDecorationLine: "underline"}}>
              {isSignup
                ? "Already have an account? Log In"
                : "Sign up for an account"}
            </SizableText>
          </XStack>
        </Form>
      </Card>
    </YStack>
  );
}

function handleAuthenticationError(err, setError) {
  const handleUnknownError = () => {
    setError((prevError) => ({
      ...prevError,
      other: "Something went wrong. Try again in a little bit.",
    }));
    console.warn(
      "Something went wrong with a Realm login or signup request. See the following error for details."
    );
    console.error(err);
  };
  if (err instanceof Realm.MongoDBRealmError) {
    const { error, statusCode } = err;
    const errorType = error || statusCode;
    switch (errorType) {
      case "invalid username":
        setError((prevError) => ({
          ...prevError,
          email: "Invalid email address.",
        }));
        break;
      case "invalid username/password":
      case "invalid password":
      case 401:
        setError((prevError) => ({
          ...prevError,
          password: "Incorrect password.",
        }));
        break;
      case "name already in use":
      case 409:
        setError((prevError) => ({
          ...prevError,
          email: "Email is already registered.",
        }));
        break;
      case "password must be between 6 and 128 characters":
      case 400:
        setError((prevError) => ({
          ...prevError,
          password: "Password must be between 6 and 128 characters.",
        }));
        break;
      default:
        handleUnknownError();
        break;
    }
  } else {
    handleUnknownError();
  }
}