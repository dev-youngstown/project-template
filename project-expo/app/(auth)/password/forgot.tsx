import { forgotPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import {
  Text,
  Heading,
  VStack,
  Button,
  ButtonText,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@gluestack-ui/themed";
import FormContainer from "@/components/forms/container";
import { router } from "expo-router";
import { ControlledInputField } from "@/components/forms/inputs";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
}

export default function PasswordForgot() {
  const toast = useToast();
  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
  });

  const { handleSubmit, control } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    forgotPasswordMutation.mutate(data.email);
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
