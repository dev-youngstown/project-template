import { Box, CircularProgress } from "@mui/material";

/**
 * LoadingIndicator component is used to show a loading indicator. Displayed in the center of the screen with primary color.
 *
 * Extends MUI CircularProgress component.
 *
 */
export const LoadingIndicator = () => {
    return (
        <Box
            flexGrow={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <CircularProgress />
        </Box>
    );
};
