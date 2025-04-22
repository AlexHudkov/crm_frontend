import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {authService} from "../services/authService";
import {LoginForm} from "../components/LoginForm";
import {ErrorModal} from "../components/ErrorModal";
import {useAuth} from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const {fetchCurrentUser} = useAuth();
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSubmit = async (user) => {
        setError("");
        try {
            await authService.log(user);
            await fetchCurrentUser();
            navigate("/orders");
        } catch (error) {
            setError("Invalid email or password");
            setIsModalOpen(true);
        }
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <LoginForm onSubmit={onSubmit}/>
            <ErrorModal open={isModalOpen} onClose={handleCloseModal} message={error}/>
        </div>
    );
};

export {LoginPage};