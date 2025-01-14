import { resetPassword } from "@/api";
import { useAuth } from "@/components/";
import { FormBox, FormScreenContainer } from "@/components/forms/container";
import { project } from "@/config";
import { Box, Link, Typography } from "@mui/material";
import {
    FormButton as Button,
    FormContainer,
    FormPasswordElement,
} from "@rhf-kit/mui";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface FormData {
    newPassword: string;
    confirmNewPassword: string;
}

const ResetPassword = () => {
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    const resetPasswordMutation = useMutation({
        mutationFn: resetPassword,
    });
    const [searchParams] = useSearchParams();

    const onSubmit = (data: FormData) => {
        const token = searchParams.get("token");

        if (!token) {
            return;
        }

        resetPasswordMutation.mutate({
            token: token,
            new_password: data.newPassword,
        });
    };

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated, navigate]);

    if (!searchParams.has("token")) {
        throw new Error("Reset token is required");
    }

    return (
        <FormScreenContainer>
            <FormBox>
                <FormContainer
                    defaultValues={{
                        newPassword: "",
                        confirmNewPassword: "",
                    }}
                    onSuccess={onSubmit}
                >
                    <Typography
                        variant={"h4"}
                        fontWeight={600}
                        textAlign={"center"}
                        gutterBottom
                    >
                        Reset Password
                    </Typography>
                    <Typography gutterBottom>
                        Enter and confirm your new password below to reset it.
                    </Typography>
                    <FormPasswordElement
                        name={"newPassword"}
                        required
                        fullWidth
                        label="New Password"
                        margin="normal"
                    />
                    <FormPasswordElement
                        name={"confirmNewPassword"}
                        required
                        fullWidth
                        label="Confirm New Password"
                        margin="normal"
                        rules={{
                            required: "Confirm New Password is required",
                            validate: (value, formValues) =>
                                value === formValues.newPassword ||
                                "Passwords do not match",
                        }}
                    />
                    <Button
                        fullWidth
                        disabled={resetPasswordMutation.isPending}
                    >
                        Reset Password
                    </Button>
                    <Typography mt={2}>
                        <Link href="/login">Back to Sign In</Link>
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

export default ResetPassword;
