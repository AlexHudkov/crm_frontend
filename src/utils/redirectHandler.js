let isRedirecting = false;

const startRedirecting = () => {
    if (!isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem("access");
        window.location.href = "/login";
    }
};

export {startRedirecting};