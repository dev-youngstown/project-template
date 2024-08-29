import { config } from "@gluestack-ui/config"; // Optional if you want to use default theme
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Slot } from "expo-router";
import { AuthProvider } from "../components/context/AuthProvider";

export default function RootLayout() {
    return (
        <AuthProvider>
            <GluestackUIProvider config={config}>
                <Slot />
            </GluestackUIProvider>
        </AuthProvider>
    );
}
