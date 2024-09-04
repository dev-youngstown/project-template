import { login, userRegister } from "@/api/auth";
import { useAuth } from "@/components/context/AuthProvider";
import FormContainer from "@/components/forms/container";
import { ControlledInputField } from "@/components/forms/inputs";
import Button from "@/components/ui/button";
import { Heading, VStack } from "@gluestack-ui/themed";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
}

export default function Register() {
    const { session, authenticated } = useAuth();
    const { handleSubmit, watch, control } = useForm<FormData>();
    const registerMutation = useMutation({
        mutationFn: (data: FormData) =>
            userRegister(
                data.email,
                data.password,
                data.first_name,
                data.last_name
            ),
    });
    const loginMutation = useMutation({
        mutationFn: (data: { email: string; password: string }) =>
            login(data.email, data.password),
    });
    const [sessionStatus, setSessionStatus] = useState<
        "not-started" | "loading"
    >("not-started");
    const [newUser, setNewUser] = useState<{
        email: string;
        password: string;
    }>();

    const onSubmit = handleSubmit((data: FormData) => {
        registerMutation.mutate(data);
        setNewUser({
            email: data.email,
            password: data.password,
        });
    });

    useEffect(() => {
        if (registerMutation.isSuccess && newUser) {
            loginMutation.mutate(newUser);
        }
        if (loginMutation.isSuccess) {
            const { access_token, refresh_token } = loginMutation.data;
            if (sessionStatus === "not-started") {
                setSessionStatus("loading");
                session.create(access_token, refresh_token);
            }
        }
    }, [registerMutation, loginMutation, newUser]);

    if (authenticated) {
        return <Redirect href="/" />;
    }

    return (
        <FormContainer>
            <Heading>Create an account</Heading>
            <VStack gap="$4" my="$2">
                {/* FIRST NAME */}
                <ControlledInputField
                    name="first_name"
                    control={control}
                    rules={{ required: "First name is required" }}
                    labelText="First Name"
                    isRequired
                    placeholder="John"
                />
                {/* LAST NAME */}
                <ControlledInputField
                    name="last_name"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    labelText="Last Name"
                    isRequired
                    placeholder="Doe"
                />
                {/* EMAIL */}
                <ControlledInputField
                    name="email"
                    control={control}
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Please enter a valid email address.",
                        },
                    }}
                    labelText="Email"
                    isRequired
                    placeholder="email@example.com"
                />
                {/* PASSWORD */}
                <ControlledInputField
                    name="password"
                    control={control}
                    rules={{ required: "Password is required" }}
                    labelText="Password"
                    isRequired
                    placeholder="********"
                    type="password"
                />
                {/* PASSWORD CONFIRMATION */}
                <ControlledInputField
                    name="password_confirmation"
                    control={control}
                    rules={{
                        required: "Confirm password is required",
                        validate: (value: string) =>
                            value === watch("password") ||
                            "Passwords do not match",
                    }}
                    labelText="Confirm Password"
                    isRequired
                    placeholder="********"
                    type="password"
                />
                <Button
                    text="Register"
                    loading={
                        registerMutation.isPending ||
                        loginMutation.isPending ||
                        sessionStatus === "loading"
                    }
                    onPress={onSubmit}
                />
            </VStack>
        </FormContainer>
    );
}
