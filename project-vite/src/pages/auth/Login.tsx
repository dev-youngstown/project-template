import project from "@/config/project";
import Link from "@/components/ui/link";
import { Box, Typography } from "@mui/material";
import { useAsync } from "@react-hookz/web";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as APILogin } from "@/api/auth";
import { FormBox, FormScreenContainer } from "@/components/forms/container";
import { useAuth } from "@/components/context/AuthContext";
import {
  FormContainer,
  FormEmailElement,
  FormPasswordElement,
} from "@rhf-kit/mui";
import Button from "@/components/ui/button.tsx";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { session, authenticated } = useAuth();
  const navigate = useNavigate();
  const [loginState, loginActions] = useAsync(APILogin);
  const [status, setStatus] = useState<"not-executed" | "loading">(
    "not-executed"
  );
  const [error, setError] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    setError(false);
    loginActions.execute(data.email, data.password);
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (loginState.status === "success" && loginState.result) {
      if (status === "not-executed") {
        setStatus("loading");
        session.create(loginState.result.access_token);
      }
    }
    if (loginState.status === "error") {
      setError(true);
    }
  }, [loginState, navigate, session, status]);

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
            loading={loginState.status === "loading" || status === "loading"}
            variant={"contained"}
            loadingPosition={"end"}
            fullWidth
          >
            Sign In
          </Button>

          <Typography mt={1}>
            Don't have an account? <Link href="/register">Sign Up</Link>
          </Typography>
          <Typography mt={2}>
            <Link href="/password/forgot">Forgot Password?</Link>
          </Typography>
        </FormContainer>
      </FormBox>
      <Box color="GrayText">
        <Typography mt={2}>© 2024 {project.name} - Terms of Use</Typography>
      </Box>
    </FormScreenContainer>
  );
};

export default Login;
