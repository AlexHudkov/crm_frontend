import {apiService} from "./apiService";

export const commentService = {
    async add(orderId, text) {
        const {data} = await apiService.post(`/api/orders/${orderId}/add-comment/`, {text});
        return data;
    },
    async remove(orderId, commentId) {
        await apiService.delete(`/api/orders/${orderId}/comments/${commentId}/`);
    }
};