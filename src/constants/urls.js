const baseURL = "/api";

const urls = {
    auth: {
        login: `${baseURL}/auth/`,
        socket: `${baseURL}/auth/socket-token/`,
    },
    orders: `${baseURL}/orders/`,
};

export {baseURL, urls};