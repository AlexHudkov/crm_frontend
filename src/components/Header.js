import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {Box, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCog, faSignOutAlt, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {authService} from "../services/authService";


const Header = () => {
    const {currentUser, setCurrentUser, setIsAuthenticated} = useAuth();
    const navigate = useNavigate();


    const handleLogout = async () => {
        await authService.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate("/login", {replace: true});
    };

    const isAdminPage = window.location.pathname === "/admin";

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "#5facf3",
            color: "white",
        }}>
            <Typography variant="h6">Logo</Typography>
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Typography>{currentUser?.name}</Typography>
                {currentUser?.role === "admin" && (
                    <button
                        style={{
                            backgroundColor: "#0f73ec",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate(isAdminPage ? "/orders" : "/admin")}
                    >
                        <FontAwesomeIcon
                            icon={isAdminPage ? faArrowLeft : faUserCog}
                            color="white"
                            size="2x"
                        />
                    </button>
                )}
                <button
                    style={{
                        backgroundColor: "#0f73ec",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer"
                    }}
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} color="white" size="2x"/>
                </button>
            </Box>
        </Box>
    );
};

export {Header};
