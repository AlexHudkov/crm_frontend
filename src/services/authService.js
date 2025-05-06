import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {openApi} from "./openApi";

const authService = {
    async log(user) {
        const {data: {access, refresh}} = await apiService.post(urls.auth.login, user);
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
    },

    async logout() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    },

    async recoverPassword(token, password) {
        return openApi.patch(`/api/auth/recovery/${token}/`, {password}, {
            headers: {
                Authorization: undefined
            }
        });
    },

    async getSocketToken() {
        const {data: {token}} = await apiService.get(urls.auth.socket);
        return token;
    },

    async getCurrentUser() {
        const {data} = await apiService.get("/api/auth/current-user/");
        return data;
    }
};

export {authService};
