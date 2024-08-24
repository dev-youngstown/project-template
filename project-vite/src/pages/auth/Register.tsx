import project from "@/config/project";
import { ArrowLeft } from "lucide-react";
import { Box, Typography } from "@mui/material";
import Link from "@/components/ui/link";
import { FormBox, FormScreenContainer } from "@/components/forms/container";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/auth";
import { useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FormContainer,
  FormEmailElement,
  FormPasswordElement,
  FormTextFieldElement,
} from "@rhf-kit/mui";
import Button from "@/components/ui/button.tsx";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const registerMutation = useMutation({
    mutationFn: registerUser,
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    registerMutation.mutate({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
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
        <FormContainer onSuccess={onSubmit}>
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
            Sign Up
          </Typography>
          <Typography gutterBottom>
            Welcome to {project.name}. Please enter your details below to create
            an account.
          </Typography>
          <FormTextFieldElement
            name="firstName"
            required
            fullWidth
            label="First Name"
            margin="normal"
          />
          <FormTextFieldElement
            name="lastName"
            required
            fullWidth
            label="Last Name"
            margin="normal"
          />
          <FormEmailElement
            name="email"
            required
            fullWidth
            label="Email Address"
            margin="normal"
          />

          <FormPasswordElement
            required
            fullWidth
            label="Password"
            margin="normal"
            name="password"
          />
          <FormPasswordElement
            required
            fullWidth
            label="Confirm Password"
            margin="normal"
            name="confirmPassword"
            rules={{
              validate: (value, formValues) =>
                value === formValues.password || "Passwords do not match",
            }}
          />

          <Button
            fullWidth
            loadingPosition={"end"}
            loading={registerMutation.isPending}
            variant={"contained"}
          >
            Sign Up
          </Button>
        </FormContainer>
      </FormBox>
      <Box color="GrayText">
        <Typography mt={2}>© 2024 {project.name} - Terms of Use</Typography>
      </Box>
    </FormScreenContainer>
  );
};

export default Register;
