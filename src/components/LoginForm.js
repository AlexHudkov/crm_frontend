import React from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";

const LoginForm = ({onSubmit}) => {
    const {handleSubmit, register, formState: { errors }} = useForm();

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                width: 300,
                margin: "100px auto",
                textAlign: "center",
                padding: 3,
                border: "1px solid #ccc",
                borderRadius: 4,
            }}
        >
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                    }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="off"
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                {...register("password", {
                    required: "Password is required",
                    pattern: {
                        value: /^[a-zA-Z0-9!@#$%^&*()_+-=]*$/,
                        message: "Password must contain only Latin characters"
                    }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}

                autoComplete="off"
            />
            <Button variant="contained" type="submit" fullWidth sx={{marginTop: 2}}>
                Login
            </Button>
        </Box>
    );
};

export {LoginForm};
