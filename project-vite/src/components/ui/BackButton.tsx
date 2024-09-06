import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            size={"small"}
            sx={{ mb: 2 }}
        >
            Back
        </Button>
    );
};
