import {
  Button,
  ButtonText,
  Heading,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { useAsync } from "@react-hookz/web";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../../api/auth";
import FormContainer from "../../../components/forms/container";
import { ControlledInputField } from "../../../components/forms/inputs";

interface FormData {
  email: string;
}

export default function PasswordForgot() {
  const toast = useToast();
  const [, forgotPasswordActions] = useAsync(forgotPassword);

  const { handleSubmit, control } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    forgotPasswordActions.execute(data.email);
    toast.show({
      placement: "bottom",
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <Toast nativeID={toastId} action="success" variant="accent">
            <VStack space="xs">
              <ToastTitle>Email Sent!</ToastTitle>
              <ToastDescription>
                Please check your email for the reset link.
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
    router.replace("password/reset");
  });

  return (
    <FormContainer>
      <Heading>Forgot Password</Heading>
      <Text fontSize="$sm">
        Enter your email address and we will send you a link to reset your
        password.
      </Text>
      <VStack gap="$4" my="$4">
        <ControlledInputField
          labelText="Email"
          placeholder="email@example.com"
          type="text"
          control={control}
          name="email"
          isRequired
          rules={{ required: "Email is required" }}
        />
        <Button onPress={onSubmit}>
          <ButtonText>Send Reset Link</ButtonText>
        </Button>
      </VStack>
    </FormContainer>
  );
}
