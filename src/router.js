import React from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";

import {MainLayout} from "./layouts/MainLayout";
import {OrdersPage} from "./pages/OrdersPage";
import {LoginPage} from "./pages/LoginPage";
import {AdminPage} from "./pages/AdminPage";
import {ActivatePage} from "./pages/ActivatePage";


const router = createBrowserRouter([
    {
        path: "", element: <MainLayout/>, children: [
            {
                index: true, element: <Navigate to={'login'}/>
            },
            {
                path: 'login', element: <LoginPage/>
            },
            {
                path: 'orders', element: <OrdersPage/>
            },
            {
                path: 'admin', element: <AdminPage/>
            },
            {
                path: '/activate/:token', element: <ActivatePage/>
            }
        ]
    }
]);

export {
    router
};