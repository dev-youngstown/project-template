import { createTheme } from "@mui/material";

export const project = {
    name: "Vite Template",
};

export default project;

export const styles = {
    primaryColor: "#1890ff",
    secondaryColor: "#f5222d",
    successColor: "#52c41a",
    warningColor: "#faad14",
    infoColor: "#1890ff",
    errorColor: "#f5222d",
};

export const theme = createTheme({
    palette: {
        primary: { main: styles.primaryColor },
        secondary: {
            main: styles.secondaryColor,
        },
        success: {
            main: styles.successColor,
        },
        warning: {
            main: styles.warningColor,
        },
        info: {
            main: styles.infoColor,
        },
        error: {
            main: styles.errorColor,
        },
    },
});
