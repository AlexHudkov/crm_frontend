import React from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";

const LoginForm = ({onSubmit}) => {
    const {handleSubmit, register} = useForm();

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
                {...register("email")}
                autoComplete="off"
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                {...register("password")}
                autoComplete="off"
            />
            <Button variant="contained" type="submit" fullWidth sx={{marginTop: 2}}>
                Login
            </Button>
        </Box>
    );
};

export {LoginForm};
