import { useAuth } from "@/components/";
import project from "@/config/project";
import { Button, Typography } from "@mui/material";

const Home = () => {
    const { session, authenticated, user } = useAuth();

    return (
        <main
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography fontSize="2rem" fontWeight="bold">
                Welcome to the {project.name} home page!
            </Typography>
            {authenticated ? (
                <>
                    <Typography textAlign="center" fontSize="1.5rem">
                        Welcome, {user?.first_name}!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => session.end()}
                    >
                        Logout
                    </Button>
                </>
            ) : (
                <Typography textAlign="center" fontSize="1.5rem">
                    You are not authenticated, <a href="/login">login</a>.
                </Typography>
            )}
        </main>
    );
};

export default Home;
