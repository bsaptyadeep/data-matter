import React, { useEffect, useState } from 'react';
import css from './styles.module.css';
import { Box, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProfileIcon from '../../../assets/user-profile-pic.jpg';
import Logo from '../../../assets/DataMatter_logo.jpeg';
import Loader from '../../../assets/loader.json';
import Lottie from 'lottie-react';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../utils/apiHandler';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import AutoScrollBottom from '../../../utils/components/AutoScrollBottom/index';
import { v4 as uuidv4 } from 'uuid';

interface IChatResponse {
    _id: string,
    user?: string,
    response?: {
        response: string,
        sql_query: string,
    }
}

const ChatApp = () => {
    const [isNavigationPanelExpanded, setIsNavigationPanelExpanded] = useState<boolean>(false)
    const [chatContent, setChatContent] = useState<IChatResponse[]>([])
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const { accessToken } = useSelector((state: RootState) => state.user);
    const [userMessage, setUserMessage] = useState<string>("")
    const [fetchingChatResponse, setFetchingChatResponse] = useState<boolean>(false)
    const assistantId: string = params.get("assistant_id") || ""
    const [queryQuestionGettingProcess, setQueryQuestionGettingProcess] = useState<string>("")
    const navigate = useNavigate()

    useEffect(() => {
        const getChatHistory = async () => {
            try {
                const apiResponse = await apiClient("GET", `/chat/?assistant_id=${assistantId}`, {})
                if (apiResponse.status === "SUCCESS") {
                    setChatContent(apiResponse.data.chat_history.chats.map((chat: { user: any; bot: any; sql_query: any; }) => {
                        return {
                            _id: uuidv4(),
                            user: chat.user,
                            response: {
                                response: chat.bot,
                                sql_query: chat.sql_query,
                            }
                        }
                    }))
                } else {
                    // TODO: error alert
                }
            } catch (error) {
                // TODO: error alert
            }
        }
        if (assistantId) {
            getChatHistory()
        }
        if (!accessToken) {
            navigate("/auth")
        }
    }, [navigate, accessToken, assistantId])

    const handleToggleNavigationPanelExpand = () => {
        setIsNavigationPanelExpanded(prevState => !prevState)
    }

    const handleChangeUserMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserMessage(event.target.value)
    }

    const handleGetChatResponse = async () => {
        if (!userMessage) return;
        try {
            setFetchingChatResponse(true)
            setQueryQuestionGettingProcess(userMessage)
            setUserMessage("")
            const apiResponse = await apiClient("POST", `/chat/get-response?assistant_id=${assistantId}&query=${userMessage}`, {})
            if (apiResponse.status === "SUCCESS") {
                setChatContent(prevState => {
                    return [
                        ...prevState,
                        {
                            _id: `id-${prevState.length}`,
                            ...apiResponse.data.chat_content
                        }
                    ]
                })
            }
            setQueryQuestionGettingProcess("")
        } catch (error) {
            alert(error)
        } finally {
            setFetchingChatResponse(false)
        }
    }

    const handleEnterPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            handleGetChatResponse()
        }
    }

    return (
        <Box style={{ height: window.innerHeight }} className={css.chatAppContainer}>
            <Box className={`${css.navigationPanel}
            ${isNavigationPanelExpanded && css.navigationPanelExpand}
            `}>
                <Box className={css.navigationPanelTop}>
                    <IconButton
                        onClick={handleToggleNavigationPanelExpand}>
                        <MenuIcon className={css.navigateMenuIcon} />
                    </IconButton>
                </Box>
            </Box>
            <Box className={css.chatContentContainer}>
                <AutoScrollBottom>
                    <Box className={css.chatContent}>
                        {
                            chatContent.map((content, index) => (
                                <Box key={index} className={css.userResponseContainer}>
                                    <Box className={css.userMessageBoxContainer}>
                                        <img src={ProfileIcon} alt={"user-profile-pic"} />
                                        <Typography>{content.user}</Typography>
                                    </Box>
                                    <Box className={css.userMessageBoxContainer}>
                                        <img src={Logo} alt={"user-profile-pic"} />
                                        <Typography>{content.response?.response}</Typography>
                                    </Box>
                                </Box>
                            ))
                        }
                        {queryQuestionGettingProcess && <Box className={css.userMessageBoxContainer}>
                            <img src={ProfileIcon} alt={"user-profile-pic"} />
                            <Typography>{queryQuestionGettingProcess}</Typography>
                        </Box>}
                        {
                            fetchingChatResponse &&
                            <Box className={css.loaderContainer}>
                                <Lottie animationData={Loader} />
                            </Box>
                        }
                    </Box>
                </AutoScrollBottom>
                <Box className={css.inputPromptContainer}>
                    <textarea
                        value={userMessage}
                        onChange={handleChangeUserMessage}
                        onKeyDown={handleEnterPress}
                        rows={3} />
                    <button className={css.sendPromptButton}
                        onClick={handleGetChatResponse}
                    >
                        <Box className={css.sendBtnContent}>
                            <Typography className={css.sendButtonText} >
                                Send
                            </Typography>
                            <SendIcon />
                        </Box>
                    </button>
                </Box>
            </Box>
        </Box >
    )
}

export default ChatApp
