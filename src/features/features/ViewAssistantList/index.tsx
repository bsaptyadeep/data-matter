import { useEffect, useState } from 'react';
import css from './style.module.css';
import { useNavigate } from 'react-router-dom';
import { IAssistant } from '../../Data';
import AssistantItem from './components/AssistantItem';
import { apiClient } from '../../../utils/apiHandler';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

const ViewAssistantList = () => {
    const navigate = useNavigate()
    const [assistantList, setAssistantList] = useState<IAssistant[]>([])
    const { accessToken } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token")
        if (!access_token) {
            navigate("/auth")
        }
    }, [navigate])

    useEffect(() => {
        fetchAssistantList()
    }, [])

    const fetchAssistantList = async () => {
        try {
            const apiResponse = await apiClient("GET", "/assistant", {})
            if (apiResponse.assistant?.length > 0) {
                setAssistantList([...apiResponse.assistant])
            }
        } catch (error) {

        }
    }

    console.log("testing~accessToken", accessToken)

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
                            <AssistantItem
                             key={`key-${assistant._id}`}
                             assistantId={assistant._id}
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
