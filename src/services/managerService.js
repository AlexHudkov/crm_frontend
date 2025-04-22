import {apiService} from "./apiService";

export const managerService = {
    async fetchAll() {
        const {data} = await apiService.get("/api/auth/admin/managers/");
        return data.results;
    },
    async fetchStats() {
        const {data} = await apiService.get("/api/auth/admin/stats/");
        return data;
    },
    async create(data) {
        await apiService.post("/api/auth/admin/create-manager/", data);
    },
    async activate(id) {
        const {data} = await apiService.post("/api/auth/admin/activate-manager/", {manager_id: id});
        return data.token;
    },
    async recovery(id) {
        const {data} = await apiService.post("/api/auth/admin/recovery-manager/", {manager_id: id});
        return data.token;
    },
    async ban(id) {
        await apiService.post("/api/auth/admin/ban-manager/", {manager_id: id});
    },
    async unban(id) {
        await apiService.post("/api/auth/admin/unban-manager/", {manager_id: id});
    },
    async remove(id) {
        await apiService.post("/api/auth/admin/delete-manager/", {manager_id: id});
    }
};
