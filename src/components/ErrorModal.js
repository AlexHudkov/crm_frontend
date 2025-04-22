import {Modal, Box, Typography, Button} from "@mui/material";

const ErrorModal = ({open, onClose, message, type = "error"}) => {
    const isError = type === "error";

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 300,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{mb: 2}}
                    color={isError ? "error" : "success.main"}
                >
                    {isError ? "Error" : "Success"}
                </Typography>
                <Typography sx={{mb: 3}}>{message}</Typography>
                <Button variant="contained" color={isError ? "error" : "success"} onClick={onClose}>
                    OK
                </Button>
            </Box>
        </Modal>
    );
};

export {ErrorModal};
