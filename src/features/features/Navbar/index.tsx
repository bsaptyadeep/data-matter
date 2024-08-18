import { Box } from '@mui/material'
import React, { ReactElement, useEffect, useState } from 'react';
import DataMavenAILogo from '../../../assets/data-maven-ai-logo.png';
import css from './styles.module.css';
import { UserService } from '../../../services/User/service';
import { IUser } from '../../../services/User/data';
import UserEmptyProfile from '../../../assets/user-profile-pic.jpg';

interface IProps {
    children: ReactElement<any, any>
}

const Navbar = (props: IProps) => {
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await UserService.getUserData()
                setUser(data)
            } catch (error) {
                alert(`Error in fetching User Details: ${error}`)
            }
        }
        fetchUserData()
    }, [])

    return (
        <Box className={css.navbar}>
            <img className={css.navbarLogo} src={DataMavenAILogo} alt="data maven ai logo" />

            {
                user &&
                <Box className={css.navUserDetails}>
                    {
                        props.children
                    }
                    <p>{user.name}</p>
                    <img className={css.navbarUserPic} src={UserEmptyProfile} alt="user profile" />
                </Box>
            }
        </Box>
    )
}

export default Navbar