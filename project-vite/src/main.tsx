import { theme } from "@/config";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
            <SnackbarProvider autoHideDuration={5000} />
        </ThemeProvider>
    </React.StrictMode>
);
