import { useEffect, useState } from 'react';
import css from './style.module.css';
import { useNavigate } from 'react-router-dom';
import { IAssistant } from '../../Data';
import AssistantItem from './components/AssistantItem';
import { apiClient } from '../../../utils/apiHandler';
import Navbar from '../Navbar';

const ViewAssistantList = () => {
    const navigate = useNavigate()
    const [assistantList, setAssistantList] = useState<IAssistant[]>([])

    useEffect(() => {
        const access_token = localStorage.getItem("access_token")
        if (!access_token) {
            navigate("/auth")
        }
    }, [navigate])

    const fetchAssistantList = async () => {
        try {
            const apiResponse = await apiClient("GET", "/assistant", {})
            if (apiResponse.assistant?.length > 0) {
                setAssistantList([...apiResponse.assistant])
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchAssistantList()
    }, [])

    return (
        <>
            <Navbar>
                <button
                    onClick={() => {
                        navigate("/add-assistant")
                    }}
                    className={`${css.addAssistantButton}`}>
                    Add New Assistant
                </button>
            </Navbar>
            <div className={css.viewAssistantListContainer}>
                {
                    assistantList.map((assistant) => {
                        return (
                            <AssistantItem key={assistant._id}
                                assistant={assistant}
                                fetchAssistantList={fetchAssistantList} />
                        )
                    })
                }
            </div>
        </>

    )
}

export default ViewAssistantList
