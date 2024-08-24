import project from "@/config/project";
import { Box, Typography } from "@mui/material";
import { FormBox, FormScreenContainer } from "@/components/forms/container";
import Button from "@/components/ui/button";
import Link from "@/components/ui/link";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { FormContainer, FormEmailElement } from "@rhf-kit/mui";

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
    enqueueSnackbar("Success! Please check your email for the reset link.", {
      variant: "success",
    });
    navigate("/password/reset");
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  return (
    <FormScreenContainer>
      <FormBox>
        <FormContainer defaultValues={{ email: "" }} onSuccess={onSubmit}>
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
            Enter your email address below and we'll send you a link to reset
            your password.
          </Typography>
          <FormEmailElement
            name="email"
            required
            fullWidth
            label="Email Address"
            margin="normal"
          />
          <Button fullWidth loading={forgotPasswordMutation.isPending}>
            Submit
          </Button>
        </FormContainer>
      </FormBox>
      <Box color="GrayText">
        <Typography mt={2}>© 2024 {project.name} - Terms of Use</Typography>
      </Box>
    </FormScreenContainer>
  );
};

export default ForgotPassword;
