import project from "../../config/project";
import { Box, Typography } from "@mui/material";
import { FormBox, FormScreenContainer } from "../../components/forms/container";
import Button from "../../components/ui/button";
import Link from "../../components/ui/link";
import { resetPassword } from "../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useEffect } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FormContainer,
  FormPasswordElement,
  FormTextFieldElement,
} from "@rhf-kit/mui";

interface FormData {
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPassword = () => {
  const { authenticated } = useAuth();
  const [resetPasswordState, resetPasswordActions] = useAsync(resetPassword);
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    resetPasswordActions.execute({
      token: data.resetToken,
      new_password: data.newPassword,
    });
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
          defaultValues={{
            resetToken: "",
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
            Enter the reset token and your new password below to reset your
            password.
          </Typography>
          <FormTextFieldElement
            name={"resetToken"}
            required
            fullWidth
            label="Reset Token"
            margin="normal"
          />
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
                value === formValues.newPassword || "Passwords do not match",
            }}
          />
          <Button fullWidth disabled={resetPasswordState.status === "loading"}>
            Reset Password
          </Button>
          <Typography mt={2}>
            <Link href="/login">Back to Sign In</Link>
          </Typography>
        </FormContainer>
      </FormBox>
      <Box color="GrayText">
        <Typography mt={2}>© 2024 {project.name} - Terms of Use</Typography>
      </Box>
    </FormScreenContainer>
  );
};

export default ResetPassword;
