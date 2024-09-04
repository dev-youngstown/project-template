import { AuthProvider } from "@/components/context/AuthProvider";
import { config } from "@gluestack-ui/config"; // Optional if you want to use default theme
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <GluestackUIProvider config={config}>
                    <Slot />
                </GluestackUIProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
