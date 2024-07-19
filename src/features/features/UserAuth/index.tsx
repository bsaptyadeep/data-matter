import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Box } from '@mui/material';
import css from './styles.module.css';
import Logo from '../../../assets/DataMatter_logo.jpeg';
import axios from 'axios';
import { GET_USER_GOOGLE_PROFILE_URL, SERVER_BASE_URL } from '../../../constants';
import { useNavigate } from 'react-router-dom';
interface IGoogleAuthResponse {
    credential: string,
    clientId: string,
    select_by: string
}

function UserAuth() {
    const navigate = useNavigate()

    const responseMessage = async (response: IGoogleAuthResponse | any) => {
        try {
            const userProfile = await axios.get(`${GET_USER_GOOGLE_PROFILE_URL}?id_token=${response.credential}`)
            const registerUserPayload = {
                name: userProfile.data.name,
                email_id: userProfile.data.email,
                image_url: userProfile.data.picture,
                client_id: response.clientId
            }
            await axios.post(`${SERVER_BASE_URL}/user`, registerUserPayload)
            await handleLogin(registerUserPayload)
        } catch (error) {

        }
    };

    const handleLogin = async (payload: any) => {
        try {
            const { data } = await axios.post(`${SERVER_BASE_URL}/user/login`, payload)
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                navigate("/")
            }

        } catch (error) {

        }
    }

    const errorMessage = () => {
        console.log("Failed to login/Register using Google");
    };
    return (
        <Box className={css.userAuth}>
            <Box className={css.userAuthContainer}>
                <img className={css.userAuthLogo} src={Logo} height={70} alt="logo" />
                <h2>Welcome to DataMatter</h2>
                <p>Login/Register using Google</p>
                <br />
                <br />
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </Box>
        </Box>
    )
}

export default UserAuth
