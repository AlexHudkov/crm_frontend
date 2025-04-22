import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Box, TextField, Button, Typography, CircularProgress
} from "@mui/material";
import {ErrorModal} from "../components/ErrorModal";
import {authService} from "../services/authService";

const ActivatePage = () => {
    const {token} = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("error");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!password || password.length < 6) {
            setModalMessage("Password must be at least 6 characters.");
            setModalType("error");
            setIsModalOpen(true);
            return;
        }

        if (password !== confirmPassword) {
            setModalMessage("Passwords do not match.");
            setModalType("error");
            setIsModalOpen(true);
            return;
        }

        setLoading(true);

        try {
            await authService.recoverPassword(token, password);
            setModalMessage("Password set successfully!");
            setModalType("success");
            setIsModalOpen(true);

            setTimeout(() => {
                setIsModalOpen(false);
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error("Activation error:", err);
            setModalMessage("Invalid or expired token.");
            setModalType("error");
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: 300,
                margin: "100px auto",
                padding: 3,
                border: "1px solid #ccc",
                borderRadius: 4,
                textAlign: "center",
            }}
        >
            <Typography variant="h5">Set Your Password</Typography>

            <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
                sx={{marginTop: 2}}
            >
                {loading ? <CircularProgress size={24}/> : "Submit"}
            </Button>

            <ErrorModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message={modalMessage}
                type={modalType}
            />
        </Box>
    );
};

export {ActivatePage};

