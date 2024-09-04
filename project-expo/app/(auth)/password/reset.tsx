import { resetPassword } from "@/api/auth";
import FormContainer from "@/components/forms/container";
import { ControlledInputField } from "@/components/forms/inputs";
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
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
    reset_token: string;
    password: string;
    confirmPassword: string;
}

export default function PasswordReset() {
    const { token } = useLocalSearchParams<{ token?: string }>();
    const resetPasswordMutation = useMutation({
        mutationFn: resetPassword,
    });
    const toast = useToast();
    const {
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = handleSubmit((data: FormData) => {
        resetPasswordMutation.mutate({
            token: data.reset_token,
            new_password: data.password,
        });
    });

    useEffect(() => {
        if (token) {
            setValue("reset_token", token);
        }
    }, [token]);

    useEffect(() => {
        if (resetPasswordMutation.isSuccess) {
            toast.show({
                placement: "bottom",
                render: ({ id }) => {
                    const toastId = "toast-" + id;
                    return (
                        <Toast
                            nativeID={toastId}
                            action="success"
                            variant="accent"
                        >
                            <VStack space="xs">
                                <ToastTitle>Password Reset!</ToastTitle>
                                <ToastDescription>
                                    Your password has been reset successfully.
                                </ToastDescription>
                            </VStack>
                        </Toast>
                    );
                },
            });
            router.replace("login");
        }
        if (resetPasswordMutation.isError) {
            toast.show({
                placement: "bottom",
                render: ({ id }) => {
                    const toastId = "toast-" + id;
                    return (
                        <Toast
                            nativeID={toastId}
                            action="error"
                            variant="accent"
                        >
                            <VStack space="xs">
                                <ToastTitle>Error</ToastTitle>
                                <ToastDescription>
                                    There was an error resetting your password.
                                    Please check your reset token and try again.
                                </ToastDescription>
                            </VStack>
                        </Toast>
                    );
                },
            });
        }
    }, [resetPasswordMutation]);

    return (
        <FormContainer>
            <Heading>Password Reset</Heading>
            <Text fontSize="$sm">
                Please {!token && "paste your reset token and"} enter your new
                password below.
            </Text>
            <VStack gap="$4" my="$4">
                {!token && (
                    <ControlledInputField
                        name="reset_token"
                        labelText="Reset Token"
                        control={control}
                        rules={{ required: "Reset token is required" }}
                        placeholder="Paste your reset token here"
                    />
                )}
                {/* PASSWORD */}
                <ControlledInputField
                    name="password"
                    labelText="Password"
                    control={control}
                    rules={{ required: "Password is required" }}
                    placeholder="********"
                    secureTextEntry
                    type="password"
                />
                {/* PASSWORD CONFIRMATION */}
                <ControlledInputField
                    name="confirmPassword"
                    labelText="Confirm Password"
                    control={control}
                    rules={{
                        required: "Confirm password is required",
                        validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match",
                    }}
                    placeholder="********"
                    secureTextEntry
                    type="password"
                />
                <Button onPress={onSubmit}>
                    <ButtonText>Reset Password</ButtonText>
                </Button>
            </VStack>
        </FormContainer>
    );
}
