import React, {useCallback, useEffect, useState, useRef} from "react";
import {Box, CircularProgress} from "@mui/material";
import {useSearchParams, useNavigate} from "react-router-dom";
import {Orders} from "../components/Orders";
import {Pagination} from "../components/Pagination";
import {orderService} from "../services/orderService";
import {FilterPanel} from "../components/FilterPanel";
import {useAuth} from "../context/AuthContext";
import {groupService} from "../services/groupService";
import {isEqual} from "lodash";
import {ErrorModal} from "../components/ErrorModal";

const OrdersPage = () => {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({});
    const firstRenderRef = useRef(true);
    const groupsLoaded = useRef(false);
    const prevFiltersRef = useRef(filters);
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

        setLoading(true);
        try {
            const response = await orderService.fetchOrders(page, sortOrder, filters);
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
    }, [searchParams, filters, isAuthenticated, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchOrders();
    }, [searchParams, isAuthenticated, fetchOrders]);

    useEffect(() => {
        if (!isAuthenticated || firstRenderRef.current) return;

        if (isEqual(prevFiltersRef.current, filters)) return;
        prevFiltersRef.current = filters;
        fetchOrders();
    }, [filters, fetchOrders, isAuthenticated]);

    const handleSorting = (column) => {
        const newOrdering = ordering === column ? `-${column}` : column;
        setSearchParams({page: currentPage, ordering: newOrdering});
    };

    const handlePageChange = (newPage) => {
        setSearchParams({page: newPage, ordering});
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
                onFilterChange={setFilters}
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