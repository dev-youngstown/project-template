import { forgotPassword } from "@/api";
import { useAuth } from "@/components/";
import { FormBox, FormScreenContainer } from "@/components/forms/container";
import { project } from "@/config";
import { Box, Link, Typography } from "@mui/material";
import {
    FormButton as Button,
    FormContainer,
    FormEmailElement,
} from "@rhf-kit/mui";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
    email: string;
}

const ForgotPassword = () => {
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
    });

    const onSubmit = (data: FormData) => {
        forgotPasswordMutation.mutate(data.email);
        enqueueSnackbar(
            "If there is an account registered with that email address, we will send a link to reset your password.",
            {
                variant: "success",
            }
        );
    };

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated, navigate]);

    return (
        <FormScreenContainer>
            <FormBox>
                <FormContainer
                    defaultValues={{ email: "" }}
                    onSuccess={onSubmit}
                >
                    <Link href="/login">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                    <Typography
                        variant={"h4"}
                        fontWeight={600}
                        textAlign={"center"}
                        gutterBottom
                    >
                        Forgot Password
                    </Typography>
                    <Typography gutterBottom>
                        Enter your email address below and we'll send you a link
                        to reset your password.
                    </Typography>
                    <FormEmailElement
                        name="email"
                        required
                        fullWidth
                        label="Email Address"
                        margin="normal"
                    />
                    <Button
                        fullWidth
                        loading={forgotPasswordMutation.isPending}
                    >
                        Submit
                    </Button>
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

export default ForgotPassword;
