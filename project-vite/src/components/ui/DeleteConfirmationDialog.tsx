import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { FormButton as Button } from "@rhf-kit/mui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

type DeleteConfirmationDialogProps = {
    /**
     * The ID of the entry to delete
     */
    idToDelete: number;
    /**
     * The type of the entry to delete
     */
    type: string;
    /**
     * The subject of the entry to delete
     */
    subject: string;
    /**
     * The function that deletes the entry
     */
    deleteFunction: (id: number) => Promise<unknown>;
    /**
     * The query keys to invalidate after the entry is deleted
     */
    queriesToInvalidate?: string[];
    /**
     * The open state of the dialog
     */
    open: boolean;
    /**
     * The function to set the open state of the dialog
     */
    setOpen: (open: boolean) => void;
};

/**
 * A modular dialog that confirms the deletion of an entry
 */
export const DeleteConfirmationDialog = ({
    idToDelete,
    type,
    subject,
    deleteFunction,
    queriesToInvalidate,
    open,
    setOpen,
}: DeleteConfirmationDialogProps) => {
    const queryClient = useQueryClient();

    const handleClose = () => setOpen(false);

    // Tanstack React Query Mutations
    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteFunction(idToDelete),
        onSuccess: () => {
            enqueueSnackbar(`${type} deleted successfully`, {
                variant: "success",
            });
            invalidateQueries();
            handleClose();
        },
        onError: () => {
            enqueueSnackbar(`Failed to delete ${type}`, { variant: "error" });
            handleClose();
        },
    });

    // handle invalidating queries
    const invalidateQueries = () => {
        queriesToInvalidate?.forEach((query) => {
            queryClient.invalidateQueries({ queryKey: [query] });
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle>
                <Toolbar variant="dense" disableGutters>
                    <Typography>Delete {type}</Typography>
                    <Box flexGrow={1} />
                    <IconButton edge="end" onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </DialogTitle>
            <DialogContent>
                Are you sure you want to delete <b>{subject}</b>?
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        mutate();
                    }}
                    loading={isPending}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};
