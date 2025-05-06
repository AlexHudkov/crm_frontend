import React, {useCallback, useEffect, useState, useRef} from "react";
import {Box, CircularProgress} from "@mui/material";
import {useSearchParams, useNavigate} from "react-router-dom";
import {Orders} from "../components/Orders";
import {Pagination} from "../components/Pagination";
import {orderService} from "../services/orderService";
import {FilterPanel} from "../components/FilterPanel";
import {useAuth} from "../context/AuthContext";
import {groupService} from "../services/groupService";
import {ErrorModal} from "../components/ErrorModal";

const OrdersPage = () => {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [, setFilters] = useState({});
    const groupsLoaded = useRef(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onModalClose, setOnModalClose] = useState(null);

    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const ordering = searchParams.get("ordering") || "";

    const showModal = (message, callback = null) => {
        setModalMessage(message);
        setOnModalClose(() => callback);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (onModalClose) {
            onModalClose();
            setOnModalClose(null);
        }
    };

    const cleanParams = (paramsObj) => {
        const cleaned = {};
        for (const key in paramsObj) {
            if (paramsObj[key] !== null && paramsObj[key] !== undefined && paramsObj[key] !== "") {
                cleaned[key] = paramsObj[key];
            }
        }
        return cleaned;
    };

    useEffect(() => {
        if (groupsLoaded.current) return;
        groupsLoaded.current = true;

        const fetchGroups = async () => {
            try {
                const response = await groupService.fetchGroups();
                setGroups(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    showModal("Session expired. Please login again.", () => navigate("/login"));
                } else {
                    console.error("Failed to fetch groups:", error);
                }
            }
        };

        fetchGroups();
    }, [navigate]);

    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated) return;

        const page = parseInt(searchParams.get("page") || "1", 10);
        const sortOrder = searchParams.get("ordering") || "";

        const newFilters = {};
        for (const [key, value] of searchParams.entries()) {
            if (key !== "page" && key !== "ordering") {
                newFilters[key] = value;
            }
        }

        setFilters(newFilters);

        setLoading(true);
        try {
            const response = await orderService.fetchOrders(page, sortOrder, newFilters);
            setOrders(response.results);
            setTotalPages(Math.ceil(response.count / 25));
        } catch (error) {
            if (error.response?.status === 401) {
                showModal("Session expired. Please login again.", () => navigate("/login"));
            } else {
                console.error("Failed to fetch orders:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [searchParams, isAuthenticated, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchOrders();
    }, [searchParams, isAuthenticated, fetchOrders]);

    const handleSorting = (column) => {
        const newOrdering = ordering === column ? `-${column}` : column;
        const newParams = Object.fromEntries([...searchParams.entries()]);
        newParams.ordering = newOrdering;
        newParams.page = "1";
        setSearchParams(cleanParams(newParams));
    };

    const handlePageChange = (newPage) => {
        const newParams = Object.fromEntries([...searchParams.entries()]);
        newParams.page = newPage.toString();
        setSearchParams(cleanParams(newParams));
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        const newParams = Object.fromEntries([...searchParams.entries()]);

        Object.keys(newFilters).forEach((key) => {
            if (newFilters[key]) {
                newParams[key] = newFilters[key];
            } else {
                delete newParams[key];
            }
        });

        newParams.page = "1";
        setSearchParams(cleanParams(newParams));
    };

    const handleCommentAdded = (updatedOrder) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === updatedOrder.id ? updatedOrder : order
            )
        );
    };

    return (
        <Box sx={{padding: 3}}>
            <FilterPanel
                onFilterChange={handleFilterChange}
                fetchFilteredData={fetchOrders}
                groups={groups}
                exportData={orders}
            />

            {loading ? (
                <Box sx={{display: "flex", justifyContent: "center", marginTop: 4}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <>
                    <Orders
                        orders={orders}
                        groups={groups}
                        setGroups={setGroups}
                        onUpdateOrder={handleCommentAdded}
                        handleSorting={handleSorting}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={handlePageChange}
                    />
                </>
            )}

            <ErrorModal
                open={isModalOpen}
                onClose={handleCloseModal}
                message={modalMessage}
                type="error"
            />
        </Box>
    );
};

export {OrdersPage};
