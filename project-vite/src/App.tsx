import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import {
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from "react-router";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/context/ProtectedRoute";
import { appRoutes } from "./config";
import {
    ForgotPassword,
    Home,
    Login,
    Page404,
    Register,
    ResetPassword,
} from "./pages";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect: useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
    ],
    tracesSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App = () => {
    const { base, notFound, auth } = appRoutes;

    return (
        <Router>
            <AuthProvider>
                <SentryRoutes>
                    <Route path={base} element={<Home />} />
                    <Route path={notFound} element={<Page404 />} />
                    {/* Auth Routes */}
                    <Route path={auth.login} element={<Login />} />
                    <Route path={auth.register} element={<Register />} />
                    <Route
                        path={auth.forgotPassword}
                        element={<ForgotPassword />}
                    />
                    <Route
                        path={auth.resetPassword}
                        element={<ResetPassword />}
                    />

                    {/* Session Routes */}
                    <Route element={<ProtectedRoute />}></Route>
                </SentryRoutes>
            </AuthProvider>
        </Router>
    );
};

export default App;
