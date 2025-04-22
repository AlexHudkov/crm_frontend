import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {authService} from "../services/authService";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const userLoaded = useRef(false);


    const fetchCurrentUser = async () => {
        if (currentUser) return;
        const token = localStorage.getItem("access");
        if (!token) {
            console.warn("No token found, skipping current user fetch");
            setIsAuthenticated(false);
            setCurrentUser(null);
            return;
        }

        try {
            const userData = await authService.getCurrentUser();
            setCurrentUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to fetch current user:", error);
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    };


    useEffect(() => {
        if (userLoaded.current) return;
        userLoaded.current = true;

        fetchCurrentUser();
    }, []);

    const startRedirecting = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            startRedirecting,
            currentUser,
            setCurrentUser,
            fetchCurrentUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
const useAuth = () => useContext(AuthContext);

export {AuthContext, AuthProvider, useAuth};
