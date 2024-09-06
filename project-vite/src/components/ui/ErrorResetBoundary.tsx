import { IApiAxiosError } from "@/api";
import { Stack, Typography } from "@mui/material";
import { FormButton as Button } from "@rhf-kit/mui";
import { ErrorBoundary } from "@sentry/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingIndicator } from "./LoadingIndicator";

interface IRenderErrorProps {
    /**
     * Error object.
     *
     */
    error: Error;
    /**
     * Function to reset the error.
     *
     */
    resetError: () => void;
}

/**
 * RenderError component that renders an error message.
 * @param error - Error object.
 * @param resetError - Function to reset the error.
 *
 */
const RenderError = ({ error, resetError }: IRenderErrorProps) => {
    const axiosError = error as IApiAxiosError;
    return (
        <Stack
            bgcolor="#F4F7FE"
            flexGrow={1}
            p={4}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={1}
        >
            <Typography variant={"h4"} fontWeight={600} color={"primary"}>
                An error occurred!
            </Typography>
            {error.name !== "AxiosError" && (
                <Typography variant={"h6"}>{error.message}</Typography>
            )}
            <Typography variant={"h6"}>
                {axiosError.response?.data.detail}
            </Typography>
            {axiosError.response && axiosError.response.status === 500 && (
                <Button variant={"contained"} onClick={resetError}>
                    Try again
                </Button>
            )}
        </Stack>
    );
};

interface IErrorResetBoundaryProps {
    /**
     * Children to render.
     *
     */
    children: React.ReactNode;
}

/**
 * ErrorResetBoundary that provides a fallback UI for errors and suspense for a loading fallback.
 *
 * Uses QueryErrorResetBoundary from react-query and ErrorBoundary from sentry/react.
 *
 * @param children - Children to render.
 */
export const ErrorResetBoundary = ({ children }: IErrorResetBoundaryProps) => {
    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary
                    fallback={({ error, resetError }) => (
                        <RenderError error={error} resetError={resetError} />
                    )}
                    onReset={reset}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        {children}
                    </Suspense>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
};
