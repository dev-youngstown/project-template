import { login } from "@/api/auth";
import { useAuth } from "@/components/context/AuthProvider";
import FormContainer from "@/components/forms/container";
import { ControlledInputField } from "@/components/forms/inputs";
import Button from "@/components/ui/button";
import { Heading, LinkText, Text, VStack } from "@gluestack-ui/themed";
import { useMutation } from "@tanstack/react-query";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
    email: string;
    password: string;
}

export default function Login() {
    const { session, authenticated } = useAuth();

    const { control, handleSubmit } = useForm<FormData>();

    const [sessionStatus, setSessionStatus] = useState<
        "not-started" | "loading"
    >("not-started");

    const loginMutation = useMutation({
        mutationFn: (data: FormData) => login(data.email, data.password),
    });

    const onSubmit = handleSubmit((data: FormData) => {
        loginMutation.mutate(data);
    });

    const onLogin = async (access_token: string, refresh_token: string) => {
        setSessionStatus("loading");
        session.create(access_token, refresh_token);
    };

    if (loginMutation.isSuccess) {
        const { access_token, refresh_token } = loginMutation.data;
        // usestate to prevent multiple calls
        if (sessionStatus === "not-started") {
            onLogin(access_token, refresh_token);
        }
    }

    if (authenticated) {
        return <Redirect href="/" />;
    }

    return (
        <FormContainer>
            <Heading>Welcome back!</Heading>

            {loginMutation.isError ? (
                <Text color="red">Invalid email or password</Text>
            ) : null}
            <VStack gap="$4" my="$2">
                <ControlledInputField
                    labelText="Email"
                    placeholder="email@example.com"
                    type="text"
                    control={control}
                    name="email"
                    isRequired
                    rules={{ required: "Email is required" }}
                />
                <ControlledInputField
                    labelText="Password"
                    placeholder="********"
                    type="password"
                    control={control}
                    name="password"
                    isRequired
                    rules={{ required: "Password is required" }}
                />
                <Button
                    text="Login"
                    loading={
                        loginMutation.isPending || sessionStatus === "loading"
                    }
                    onPress={onSubmit}
                />
            </VStack>
            <Link href="register">
                <LinkText>Register</LinkText>
            </Link>
            <Link href="/password/forgot">
                <LinkText>Forgot Password</LinkText>
            </Link>
        </FormContainer>
    );
}
