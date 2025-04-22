import {apiService} from "./apiService";

export const orderService = {
    async fetchOrders(currentPage, ordering, filters = {}) {
        const params = new URLSearchParams();
        params.append("page", currentPage);
        if (ordering) params.append("ordering", ordering);

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "") params.append(key, value);
        });

        const {data} = await apiService.get(`/api/orders/?${params.toString()}`);
        return data;
    },
    async update(orderId, orderData) {
        const {data} = await apiService.put(`/api/orders/${orderId}/`, orderData);
        return data;
    }
};
