import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {Box, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCog, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";


const Header = () => {
    const {currentUser, setCurrentUser, setIsAuthenticated} = useAuth();
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem("access");
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate("/login", {replace: true});
    };

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
                        onClick={() => navigate("/admin")}
                    >
                        <FontAwesomeIcon icon={faUserCog} color="white" size="2x"/>
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
