import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Box, CircularProgress } from '@mui/material';
import css from './styles.module.css';
import Logo from '../../../assets/DataMatter_logo.jpeg';
import axios from 'axios';
import { GET_USER_GOOGLE_PROFILE_URL, SERVER_BASE_URL } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../services/User/userSlice';
import { UserService } from '../../../services/User/service';
interface IGoogleAuthResponse {
    credential: string,
    clientId: string,
    select_by: string
}

function UserAuth() {
    const navigate = useNavigate()
    const dispatch: AppDispatch = useDispatch();
    const { accessToken } = useSelector((state: RootState) => state.user);
    const [loggingIn, setLoggingIn] = useState<boolean>(false);

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
        setLoggingIn(true)
        try {
            const { data } = await axios.post(`${SERVER_BASE_URL}/user/login`, payload)
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                navigate("/")
            }

        } catch (error) {

        } finally {
            setLoggingIn(false)
        }
    }

    const errorMessage = () => {
        console.log("Failed to login/Register using Google");
    };

    useEffect(() => {
        const isValidAccessToken = async (token: string) => {
            setLoggingIn(true)
            try {
                const data = await UserService.getUserData()
                if (data.status === "SUCCESS") {
                    dispatch(setUser({ accessToken: token }))
                    navigate("/")
                } else {
                    localStorage.removeItem("access_token")
                }
            } catch (error) {
                localStorage.removeItem("access_token")
            } finally {
                setLoggingIn(false)
            }
        }

        const access_token_local = localStorage.getItem('access_token');
        if (accessToken) {
            localStorage.setItem('access_token', accessToken)
            navigate("/")
        }
        else if (access_token_local) {
            isValidAccessToken(access_token_local)
        }
    }, [navigate, dispatch, accessToken])

    return (
        <Box className={css.userAuth}>
            <Box className={css.userAuthContainer}>
                <img className={css.userAuthLogo} src={Logo} height={70} alt="logo" />
                <h2>Welcome to DataMatter</h2>
                <p>Login/Register using Google</p>
                <br />
                <br />
                {
                    loggingIn ?
                        <CircularProgress style={{ color: "white" }} />
                        :
                        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />}
            </Box>
        </Box>
    )
}

export default UserAuth
