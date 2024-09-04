import { useAuth } from "@/components/context/AuthProvider";
import {
    Box,
    Button,
    ButtonText,
    Heading,
    LinkText,
    Text,
    VStack,
} from "@gluestack-ui/themed";
import { Link } from "expo-router";
import * as Sentry from "sentry-expo";
import project from "../config/project";

export default function Home() {
    const { session, authenticated, user } = useAuth();

    // sentry
    Sentry.init({
        dsn: process.env.SENTRY_DSN || "",
        enableInExpoDevelopment: false,
        debug: false,
    });

    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <VStack gap="$4">
                <Heading textAlign="center">
                    Welcome to the {project.name} home page!
                </Heading>

                {authenticated ? (
                    <>
                        <Text textAlign="center">
                            Welcome {user.first_name}!
                        </Text>
                        <Box alignItems="center">
                            <Link href="/profile">
                                <LinkText>Profile</LinkText>
                            </Link>
                        </Box>
                        <Button
                            onPress={() => {
                                session.end();
                            }}
                            action="negative"
                        >
                            <ButtonText>Logout</ButtonText>
                        </Button>
                    </>
                ) : (
                    <Box alignItems="center">
                        <Link href="/login">
                            <LinkText>Login</LinkText>
                        </Link>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}
