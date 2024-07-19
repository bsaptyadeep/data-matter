import { useEffect, useState } from 'react';
import css from './style.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IAssistant } from '../../Data';
import AssistantItem from './components/AssistantItem';

const ViewAssistantList = () => {
    const navigate = useNavigate()
    const [assistantList, setAssistantList] = useState<IAssistant[]>([])

    useEffect(() => {
        const access_token = localStorage.getItem("access_token")
        if (!access_token) {
            navigate("/auth")
        }
    }, [navigate])


    useEffect(() => {
        const fetchAssistantList = async () => {
            try {
                const apiResponse = await axios.get("http://localhost:8000/assistant/")
                if (apiResponse.data.assistant?.length > 0) {
                    setAssistantList([...apiResponse.data.assistant])
                }
            } catch (error) {

            }
        }
        fetchAssistantList()
    }, [])

    return (
        <div className={css.viewAssistantListContainer}>
            <button
                onClick={() => {
                    navigate("/add-assistant")
                }}
                className={`${css.addAssistantButton}`}>
                Add New Assistant
            </button>
            {
                assistantList.map((assistant) => {
                    return (
                        <AssistantItem
                            assistant={assistant} />
                    )
                })
            }
        </div>
    )
}

export default ViewAssistantList
