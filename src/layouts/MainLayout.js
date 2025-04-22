import React from 'react';
import {Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {Header} from "../components/Header";

const MainLayout = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const location = useLocation();
    const showHeader = isAuthenticated && currentUser && location.pathname !== "/login";

    return (
        <div>
            {showHeader && <Header />}
            <Outlet />
        </div>
    );
};

export { MainLayout };