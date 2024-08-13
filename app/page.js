'use client'
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import Joi from 'joi';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SignUp() {
    const { push } = useRouter()
    const [formData, setFormdata] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleOnChange = (event) => {
        setFormdata({ ...formData, [event.target.name]: event.target.value });
    };

    const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.empty': 'Email is required.',
            'string.email': 'Enter a valid email.',
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
        })
    });


    const validate = () => {
        const { error } = schema.validate(formData, { abortEarly: false });
        if (!error) return null;
        const newErrors = {};
        error.details.forEach(item => {
            newErrors[item.path[0]] = item.message;
        });
        return newErrors;
    };


    const handleOnClick = async () => {
        const validationErrors = validate();
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try {
            let reqData = {
                'email': formData.email,
                'password': formData.password,
            }

            let res = await axios.post(`${API_URL}/signIn`, reqData);
            if (res?.data) {
                localStorage.setItem('token', res?.data?.token || null)
                push("/dashboard?session_id=abcd");
                alert(res?.data?.message)
            }
            else {
                alert(res?.error?.data?.message)
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="formData" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={1}>

                        <Grid item xs={12} >
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={handleOnChange}
                            />
                            {errors.email && <p style={{ color: 'red', margin: '4px 0' }}>{errors.email}</p>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={handleOnChange}
                            />
                            {errors.password && <p style={{ color: 'red', margin: '4px 0' }}>{errors.password}</p>}
                        </Grid>
                    </Grid>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => handleOnClick()}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/signUp" variant="body2">
                                Dont have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}