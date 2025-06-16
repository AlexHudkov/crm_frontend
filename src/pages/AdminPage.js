import {useState, useEffect, useCallback} from "react";
import {
    Button, Typography, Box
} from "@mui/material";
import {OrderStatistics} from "../components/OrderStatistics";
import {ErrorModal} from "../components/ErrorModal";
import {CreateManagerModal} from "../components/CreateManagerModal";
import {managerService} from "../services/managerService";
import {authService} from "../services/authService";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const AdminPage = () => {
    const [managers, setManagers] = useState([]);
    const [stats, setStats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({email: "", name: "", surname: ""});
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("error");
    const [isModalOpenMsg, setIsModalOpenMsg] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const {currentUser} = useAuth();
    const navigate = useNavigate();

    const showModal = (message, type = "error") => {
        setModalMessage(message);
        setModalType(type);
        setIsModalOpenMsg(true);
    };

    const fetchManagers = useCallback(async () => {
        try {
            const data = await managerService.fetchAll();
            setManagers(data);
        } catch (error) {
            console.error("Failed to fetch managers:", error);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const data = await managerService.fetchStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        if (currentUser.role !== "admin") {
            navigate("/orders", {replace: true});
            return;
        }

        fetchManagers();
        fetchStats();

        const fetchCurrentUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                setCurrentUserId(user.id);
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };

        fetchCurrentUser();

    }, [currentUser, navigate, fetchManagers, fetchStats]);

    if (!currentUser || currentUser.role !== "admin") {
        return null;
    }

    const handleCreateClick = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setFormData({email: "", name: "", surname: ""});
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleCreateSubmit = async () => {
        try {
            await managerService.create(formData);
            fetchManagers();
            handleClose();
        } catch (error) {
            const errorMsg = error.response?.data?.email?.[0];
            if (errorMsg?.includes("already exists")) {
                showModal("A manager with this email already exists.");
            } else {
                showModal(errorMsg || "Failed to create manager.");
            }
        }
    };

    const handleActivate = async (manager_id) => {
        try {
            const token = await managerService.activate(manager_id);
            const activationLink = `${window.location.origin}/activate/${token}`;
            await navigator.clipboard.writeText(activationLink);
            showModal("Activation link copied to clipboard!", "success");
        } catch (error) {
            console.error("Activation failed:", error);
            showModal("Failed to generate activation link.");
        }
    };

    const handleBanToggle = async (manager) => {
        if (manager.is_active) {
            await managerService.ban(manager.id);
        } else {
            await managerService.unban(manager.id);
        }
        fetchManagers();
    };

    const handleRecovery = async (manager_id) => {
        const token = await managerService.recovery(manager_id);
        const link = `${window.location.origin}/activate/${token}`;
        await navigator.clipboard.writeText(link);
        showModal("Recovery link copied to clipboard!", "success");
    };

    const handleDelete = async (manager) => {
        if (manager.is_active) {
            showModal("You can only delete a banned manager.");
            return;
        }
        await managerService.remove(manager.id);
        fetchManagers();
    };

    return (
        <Box sx={{padding: 3}}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingX: 3}}>
                <Box sx={{flexShrink: 0}}>
                    <Button
                        onClick={handleCreateClick}
                        variant="contained"
                        color="primary"
                        sx={{marginTop: 6}}
                    >
                        CREATE
                    </Button>
                </Box>

                <Box sx={{width: "300px", margin: "0 auto", textAlign: "left"}}>
                    <OrderStatistics stats={stats}/>
                </Box>
            </Box>

            <Typography variant="h5" sx={{marginTop: 3}}>Managers</Typography>

            <Box sx={{display: "flex", flexDirection: "column", gap: 2, marginTop: 2}}>
                {managers.map((manager) => (
                    <Box
                        key={manager.id}
                        sx={{
                            border: "1px solid green",
                            borderRadius: 2,
                            padding: 2,
                            backgroundColor: "#f8fff8",
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2
                        }}
                    >
                        {/* Info */}
                        <Box sx={{
                            flex: "1 1 30%",
                            minWidth: "200px",
                            maxWidth: "350px",
                            wordBreak: "break-word"
                        }}>
                            <Typography><strong>id:</strong> {manager.id}</Typography>
                            <Typography><strong>email:</strong> {manager.email}</Typography>
                            <Typography><strong>name:</strong> {manager.name}</Typography>
                            <Typography><strong>surname:</strong> {manager.surname}</Typography>
                            <Typography><strong>is active:</strong> {String(manager.is_active)}</Typography>
                            <Typography>
                                <strong>last login:</strong>{" "}
                                {manager.last_login
                                    ? new Date(manager.last_login).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    })
                                    : "null"}
                            </Typography>
                        </Box>

                        {/* Stats */}
                        <Box sx={{
                            flex: "0 0 160px",
                            minWidth: "160px"
                        }}>
                            <Typography><strong>total:</strong> {manager.total_orders}</Typography>
                            <Typography><strong>in work:</strong> {manager.in_work_orders}</Typography>
                            <Typography><strong>aggre:</strong> {manager.aggre_orders}</Typography>
                            <Typography><strong>disaggre:</strong> {manager.disaggre_orders}</Typography>
                            <Typography><strong>dubbing:</strong> {manager.dubbing_orders}</Typography>
                        </Box>

                        {/* Buttons */}
                        <Box sx={{
                            flex: "0 0 160px",
                            minWidth: "200px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1
                        }}>
                            {/* Якщо немає паролю */}
                            {!manager.has_password && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleActivate(manager.id)}
                                    >
                                        ACTIVATE
                                    </Button>

                                    <Button variant="outlined" disabled>
                                        RECOVERY PASSWORD
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(manager)}
                                    >
                                        DELETE
                                    </Button>
                                </>
                            )}

                            {/* Якщо є пароль */}
                            {manager.has_password && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color={manager.is_active ? "error" : "success"}
                                        onClick={() => handleBanToggle(manager)}
                                        disabled={manager.id === currentUserId}
                                    >
                                        {manager.is_active ? "BAN" : "UNBAN"}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={() => handleRecovery(manager.id)}
                                    >
                                        RECOVERY PASSWORD
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(manager)}
                                        disabled={manager.id === currentUserId}
                                    >
                                        DELETE
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>

            <CreateManagerModal
                open={isModalOpen}
                onClose={handleClose}
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleCreateSubmit}
            />

            <ErrorModal
                open={isModalOpenMsg}
                onClose={() => setIsModalOpenMsg(false)}
                message={modalMessage}
                type={modalType}
            />
        </Box>
    );
};

export {AdminPage};

