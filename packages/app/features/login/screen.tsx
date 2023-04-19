import { Card, Form, Input, H2, XStack, YStack, Label, Button, SizableText, Paragraph, Spinner } from "@my/ui";
import * as Realm from "realm-web"
import { useRealmApp } from "app/provider/realm";
import { useEffect, useState } from "react";
import { useRouter } from "solito/router";
import { routes } from "app/navigation/web";

export function LoginScreen() {
  const realmApp = useRealmApp();
  const router = useRouter()
  
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
  })
  if(realmApp.currentUser) {
    return <Spinner />
  }

  return (
    <YStack f={1} ai="center" jc="center">
      <Card width={400} height={600} p={16}>
        <Form onSubmit={onFormSubmit}>
          <H2>Lifelog Alpha</H2>
          <Paragraph mt={10} mb={30} lineHeight={16}>
            {isSignup
              ? "Enter your email and a password to create a new account."
              : "Enter your email and a password to log in with an existing account."}
          </Paragraph>
          {/* <NonAuthErrorAlert /> */}
          <YStack>
            <Label>Email Address</Label>
            <Input onChangeText={setEmail}/>
            {error.email && <SizableText color="red">{error.email}</SizableText>}
          </YStack>
          
          <YStack>
            <Label>Password</Label>
            <Input onChangeText={setPassword}/>
            {error.password && <SizableText color="red">{error.password}</SizableText>}
          </YStack>
          <Form.Trigger asChild>
            <Button size="$4" mt={10} mb={20}>{isSignup ? "Create Account" : "Log In"}</Button>
          </Form.Trigger>
          <XStack onPress={toggleIsSignup}>
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