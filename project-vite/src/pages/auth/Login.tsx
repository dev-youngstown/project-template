import { login as APILogin } from "@/api";
import { useAuth } from "@/components/context/AuthContext";
import { FormBox, FormScreenContainer } from "@/components/forms/container";
import { project } from "@/config";
import { Box, Link, Typography } from "@mui/material";
import {
    FormButton as Button,
    FormContainer,
    FormEmailElement,
    FormPasswordElement,
} from "@rhf-kit/mui";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
    email: string;
    password: string;
};

const Login = () => {
    const { session, authenticated } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<boolean>(false);
    const loginMutation = useMutation({
        mutationFn: (data: FormData) => APILogin(data.email, data.password),
    });

    const onSubmit = (data: FormData) => {
        setError(false);
        loginMutation.mutate({
            email: data.email,
            password: data.password,
        });
    };

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated, navigate]);

    useEffect(() => {
        if (loginMutation.isSuccess) {
            session.create(loginMutation.data.access_token);
        }
        if (loginMutation.isError) {
            setError(true);
        }
    }, [navigate, session, loginMutation]);

    return (
        <FormScreenContainer>
            <FormBox>
                <FormContainer
                    defaultValues={{ email: "", password: "" }}
                    onSuccess={onSubmit}
                >
                    <Typography
                        variant={"h4"}
                        fontWeight={600}
                        textAlign={"center"}
                        gutterBottom
                    >
                        Sign In To {project.name}
                    </Typography>
                    {error && (
                        <Box
                            sx={{
                                color: "red",
                                textAlign: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            Invalid email or password
                        </Box>
                    )}
                    <FormEmailElement
                        name={"email"}
                        label="Email Address"
                        margin="normal"
                        required
                        fullWidth
                    />
                    <FormPasswordElement
                        name={"password"}
                        label="Password"
                        margin="normal"
                        required
                        fullWidth
                    />
                    <Button
                        loading={loginMutation.isPending}
                        variant={"contained"}
                        loadingPosition={"end"}
                        fullWidth
                    >
                        Sign In
                    </Button>

                    <Typography mt={1}>
                        Don't have an account?{" "}
                        <Link href="/register">Sign Up</Link>
                    </Typography>
                    <Typography mt={2}>
                        <Link href="/password/forgot">Forgot Password?</Link>
                    </Typography>
                </FormContainer>
            </FormBox>
            <Box color="GrayText">
                <Typography mt={2}>
                    © 2024 {project.name} - Terms of Use
                </Typography>
            </Box>
        </FormScreenContainer>
    );
};

export default Login;
