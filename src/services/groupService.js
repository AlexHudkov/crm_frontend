import {apiService} from "./apiService";

export const groupService = {
    async fetchGroups() {
        return apiService.get("/api/groups/");
    },
    async createGroup(name) {
        return apiService.post("/api/groups/", {name});
    }
};